import type { InlineConfig as TsdownOptions } from 'tsdown';
import type { PluginOption, ResolvedConfig, UserConfig } from 'vite';
import type { ExtensionOptions, PluginOptions, WebviewOption } from './types';
import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { readFileSync, readJsonSync } from '@tomjs/node';
import { execa } from 'execa';
import merge from 'lodash.merge';
import { parse as htmlParser } from 'node-html-parser';
import colors from 'picocolors';
import { build as tsdownBuild } from 'tsdown';
import { ORG_NAME, RESOLVED_VIRTUAL_MODULE_ID, VIRTUAL_MODULE_ID } from './constants';
import { logger } from './logger';
import { resolveServerUrl } from './utils';

export * from './types';

const isDev = process.env.NODE_ENV === 'development';

function getPkg() {
  const pkgFile = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgFile)) {
    throw new Error('项目中未找到 package.json 文件');
  }

  const pkg = readJsonSync(pkgFile);
  if (!pkg.main) {
    throw new Error('package.json 文件未配置 main 入口文件');
  }

  return pkg;
}

function preMergeOptions(options?: PluginOptions): PluginOptions {
  const pkg = getPkg();

  const opts: PluginOptions = merge(
    {
      webview: true,
      recommended: true,
      extension: {
        entry: 'extension/index.ts',
        outDir: 'dist-extension',
        target: ['es2019', 'node16'],
        format: 'cjs',
        shims: true,
        clean: true,
        dts: false,
        treeshake: !isDev,
        publint: false,
        // ignore tsdown.config.ts from project
        config: false,
        fixedExtension: false,
        external: ['hbuilderx'],
      } as ExtensionOptions,
    } as PluginOptions,
    options,
  );

  const opt = opts.extension || {};

  if (isDev) {
    // opt.sourcemap = opt.sourcemap ?? true;
  }
  else {
    opt.minify ??= true;
    opt.clean ??= true;
  }
  if (typeof opt.external !== 'function') {
    opt.external = (['hbuilderx'] as (string | RegExp)[]).concat(opt.external ?? []);
    opt.external = [...new Set(opt.external)];
  }
  else {
    const fn = opt.external;
    opt.external = function (id, parentId, isResolved) {
      if (id === 'hbuilderx') {
        return true;
      }
      return fn(id, parentId, isResolved);
    };
  }

  if (!isDev && !opt.skipNodeModulesBundle && !opt.noExternal) {
    opt.noExternal = Object.keys(pkg.dependencies || {}).concat(
      Object.keys(pkg.peerDependencies || {}),
    );
  }

  opts.extension = opt;

  return opts;
}

function genProdWebviewCode(cache: Record<string, string>) {
  function handleHtmlCode(html: string) {
    const root = htmlParser(html);
    const head = root.querySelector('head')!;
    if (!head) {
      root?.insertAdjacentHTML('beforeend', '<head></head>');
    }

    const tags = {
      script: 'src',
      link: 'href',
    };

    Object.keys(tags).forEach((tag) => {
      const elements = root.querySelectorAll(tag);
      elements.forEach((element) => {
        const attr = element.getAttribute(tags[tag]);
        if (attr) {
          element.setAttribute(tags[tag], `{{baseUri}}${attr}`);
        }
      });
    });

    return root.removeWhitespace().toString();
  }

  const cacheCode = /* js */ `const htmlCode = {
    ${Object.keys(cache)
      .map(s => `'${s}': \`${handleHtmlCode(cache[s])}\`,`)
      .join('\n')}
  };`;

  const code = /* js */ `import path from 'path';
import { workspace } from 'hbuilderx';

${cacheCode}

export function getWebviewHtml(options){
 const { context, inputName, injectCode } = options || {};
  const baseUri = path.join(context.extensionPath, process.env.VITE_WEBVIEW_DIST || 'dist');
  let html = htmlCode[inputName || 'index'] || '';
  if (injectCode) {
    html = html.replace('<head>', '<head>'+ injectCode);
  }

  return html.replaceAll('{{baseUri}}', baseUri);
}

export default getWebviewHtml;
  `;
  return code;
}

export function useHBuilderxPlugin(options?: PluginOptions): PluginOption {
  const opts = preMergeOptions(options);

  const handleConfig = (config: UserConfig): UserConfig => {
    let outDir = config?.build?.outDir || 'dist';
    opts.extension ??= {};
    if (opts.recommended) {
      opts.extension.outDir = path.resolve(outDir, 'extension');
      outDir = path.resolve(outDir, 'webview');
    }

    // assets
    const assetsDir = config?.build?.assetsDir || 'assets';
    const output = {
      chunkFileNames: `${assetsDir}/[name].js`,
      entryFileNames: `${assetsDir}/[name].js`,
      assetFileNames: `${assetsDir}/[name].[ext]`,
    };

    let rollupOutput = config?.build?.rollupOptions?.output ?? {};
    if (Array.isArray(rollupOutput)) {
      rollupOutput.map(s => Object.assign(s, output));
    }
    else {
      rollupOutput = Object.assign({}, rollupOutput, output);
    }

    return {
      build: {
        outDir,
        rollupOptions: {
          output: rollupOutput,
        },
      },
    };
  };

  let devWebviewClientCode: string;
  let devWebviewVirtualCode: string;

  let resolvedConfig: ResolvedConfig;
  // multiple entry index.html
  const prodHtmlCache: Record<string, string> = {};

  function isVue() {
    return !!resolvedConfig.plugins.find(s => ['vite:vue', 'vite:vue2'].includes(s.name));
  }

  function isReact() {
    return !!resolvedConfig.plugins.find(s => ['vite:react-refresh', 'vite:react-swc'].includes(s.name));
  }

  function getDevtoolsPort() {
    const devtools = opts.devtools;
    if (!devtools) {
      return;
    }
    let port: number | undefined;
    if (typeof devtools === 'number') {
      port = devtools;
    }
    else if (devtools === true) {
      if (isVue()) {
        port = 8098;
      }
      else if (isReact()) {
        port = 8097;
      }
    }
    return port;
  }

  return [
    {
      name: '@tomjs:hbuilderx',
      apply: 'serve',
      config(config) {
        return handleConfig(config);
      },
      configResolved(config) {
        resolvedConfig = config;

        if (opts.webview) {
          devWebviewClientCode = readFileSync(path.join(__dirname, 'client.iife.js'));
          let refreshKey = '';
          if (opts.webview === true) {
            refreshKey = 'F6';
          }
          else if (typeof opts.webview === 'object' && opts.webview.refreshKey) {
            refreshKey = opts.webview.refreshKey;
          }
          if (refreshKey) {
            devWebviewClientCode = `window.TOMJS_REFRESH_KEY="${refreshKey}";${devWebviewClientCode}`;
          }

          devWebviewVirtualCode = readFileSync(path.join(__dirname, 'webview.js'));
        }
      },
      configureServer(server) {
        if (!server || !server.httpServer) {
          return;
        }
        server.httpServer?.once('listening', async () => {
          const env = {
            NODE_ENV: server.config.mode || 'development',
            VITE_DEV_SERVER_URL: resolveServerUrl(server),
          };

          logger.info('插件编译开始');

          const webview = opts?.webview as WebviewOption;

          const { onSuccess: _onSuccess, ignoreWatch, logLevel, watchFiles, ...tsdownOptions } = opts.extension || {};
          const entryDir = path.dirname(tsdownOptions.entry);

          await tsdownBuild(
            merge(tsdownOptions, {
              watch: watchFiles ?? (opts.recommended ? ['extension'] : true),
              ignoreWatch: (['.history', '.temp', '.tmp', '.cache', 'dist'] as (string | RegExp)[]).concat(Array.isArray(ignoreWatch) ? ignoreWatch : []),
              env,
              logLevel: logLevel ?? 'silent',
              plugins: !webview
                ? []
                : [
                    {
                      name: `${ORG_NAME}:hbuilderx:inject`,
                      resolveId(id) {
                        if (id === VIRTUAL_MODULE_ID) {
                          return RESOLVED_VIRTUAL_MODULE_ID;
                        }
                      },
                      load(id) {
                        if (id === RESOLVED_VIRTUAL_MODULE_ID)
                          return devWebviewVirtualCode;
                      },
                      watchChange(id, e) {
                        let event = '';
                        if (e.event === 'update') {
                          event = colors.green('更新');
                        }
                        else if (e.event === 'delete') {
                          event = colors.red('删除');
                        }
                        else {
                          event = colors.blue('创建');
                        }
                        logger.info(`${event} ${colors.dim(path.relative(entryDir, id))}`);
                      },
                    },
                  ],
              async onSuccess(config, signal) {
                if (_onSuccess) {
                  if (typeof _onSuccess === 'string') {
                    await execa(_onSuccess);
                  }
                  else if (typeof _onSuccess === 'function') {
                    await _onSuccess(config, signal);
                  }
                }

                logger.info('插件编译成功');
              },
            } as TsdownOptions),
          );
        });

        if (opts.devtools) {
          const _printUrls = server.printUrls;
          server.printUrls = () => {
            _printUrls();
            const { green, bold, blue } = colors;
            if (isVue() || isReact()) {
              const port = getDevtoolsPort();
              if (port) {
                const devtoolsUrl = `http://localhost:${port}`;
                console.log(`  ${green('➜')}  ${bold(isVue() ? 'Vue DevTools' : 'React DevTools')}: 已开启独立应用支持，地址 ${blue(`${devtoolsUrl}`)}`);
              }
            }
            else {
              console.log(`  ${green('➜')}  仅支持 ${green('react-devtools')} 和 ${green('vue-devtools')}`);
            }
          };
        }
      },
      transformIndexHtml(html) {
        if (!opts.webview) {
          return html;
        }

        if (opts.devtools) {
          const port = getDevtoolsPort();
          if (port) {
            html = html.replace(/<head>/i, `<head><script src="http://localhost:${port}"></script>`);
          }
        }

        return html.replace(/<head>/i, `<head><script>${devWebviewClientCode}</script>`);
      },
    },
    {
      name: '@tomjs:hbuilderx',
      apply: 'build',
      enforce: 'post',
      config(config) {
        return handleConfig(config);
      },
      configResolved(config) {
        resolvedConfig = config;
      },
      transformIndexHtml(html, ctx) {
        if (!opts.webview) {
          return html;
        }

        prodHtmlCache[ctx.chunk?.name as string] = html;
        return html;
      },
      closeBundle() {
        let webviewVirtualCode: string;

        const webview = opts?.webview as WebviewOption;
        if (webview) {
          webviewVirtualCode = genProdWebviewCode(prodHtmlCache);
        }

        let outDir = resolvedConfig.build.outDir.replace(cwd(), '').replaceAll('\\', '/');
        if (outDir.startsWith('/')) {
          outDir = outDir.substring(1);
        }
        const env = {
          NODE_ENV: resolvedConfig.mode || 'production',
          VITE_WEBVIEW_DIST: outDir,
        };

        logger.info('extension build start');

        const { onSuccess: _onSuccess, logLevel, ...tsupOptions } = opts.extension || {};

        tsdownBuild(
          merge(tsupOptions, {
            env,
            logLevel: logLevel ?? 'silent',
            plugins: !webview
              ? []
              : [
                  {
                    name: `${ORG_NAME}:hbuilderx:inject`,
                    resolveId(id) {
                      if (id === VIRTUAL_MODULE_ID) {
                        return RESOLVED_VIRTUAL_MODULE_ID;
                      }
                    },
                    load(id) {
                      if (id === RESOLVED_VIRTUAL_MODULE_ID)
                        return webviewVirtualCode;
                    },
                  },
                ],
            async onSuccess(config, signal) {
              if (_onSuccess) {
                if (typeof _onSuccess === 'string') {
                  await execa(_onSuccess);
                }
                else if (typeof _onSuccess === 'function') {
                  await _onSuccess(config, signal);
                }
              }
              logger.info('extension build success');
            },
          } as TsdownOptions),
        );
      },
    },
  ];
}

export default useHBuilderxPlugin;
