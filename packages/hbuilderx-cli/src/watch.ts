import type { ChokidarOptions } from 'chokidar';
import type { CliOptions } from './types';
import fs from 'node:fs';
import path from 'node:path';
import { mkdirp, readJson, writeFile } from '@tomjs/node';
import chokidar from 'chokidar';
import colors from 'picocolors';
import { logger } from './util';

function createWatcher(paths: string | string[], callback: () => Promise<any>) {
  const watchPaths = Array.isArray(paths) ? paths : [paths];

  const watchOptions: ChokidarOptions = {
    ignorePermissionErrors: true,
    persistent: true,
  };

  const watcher = chokidar.watch(watchPaths, watchOptions);

  let ready = false;

  watcher.on('ready', async () => {
    ready = true;

    logger.info(`监听: ${watchPaths.map(s => colors.green(s))}`);

    await callback();
  });

  watcher.on('all', async (event, path) => {
    if (!ready || ['addDir', 'unlinkDir'].includes(event)) {
      return;
    }
    logger.debug(event, path);

    try {
      await callback();
    }
    catch (e: any) {
      logger.error(e?.message);
    }
  });
}

/**
 * 监听文件变化
 */
export async function watchFiles(opts: CliOptions) {
  const pkgPath = path.join(opts.cwd || process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    logger.error(`未找到 ${colors.green(pkgPath)}`);
    return;
  }

  createWatcher(pkgPath, () => genDtsFromPkg(pkgPath, opts));
}

async function genDtsFromPkg(pkgPath: string, opts: CliOptions) {
  const pkg = await readJson(pkgPath);
  if (!pkg) {
    return logger.error(`${colors.green('package.json')} 文件解析失败`);
  }

  const contributes = pkg.contributes;
  if (!contributes) {
    return logger.error(`${colors.green('package.json')} 文件缺少 contributes 属性`);
  }

  // 命令 d.ts
  const commandCode = getCommandCode(contributes, opts);
  // 视图 d.ts
  const viewCode = getViewCode(contributes);

  const code = /* ts */ `// 通过 @tomjs/hbuilderx-cli 生成的 d.ts 文件
declare module 'hbuilderx' {
${commandCode}
${viewCode}
}
`;

  const dtsFile = opts.dts || 'hbuilderx.d.ts';
  const dtsFilePath = path.join(opts.cwd || process.cwd(), dtsFile);
  const dtsDir = path.dirname(dtsFilePath);
  await mkdirp(dtsDir);
  await writeFile(dtsFilePath, code);

  logger.success(`根据 ${colors.blue('package.json')} 生成 ${colors.green(dtsFile)}`);
};

function getValuesDtsType(types: string[]) {
  if (!Array.isArray(types) || types.length === 0) {
    return;
  }
  const list = types.map(type => `'${type}'`);
  list.sort();
  return [...new Set(list)].join(' | ');
}

function getCommandCode(contributes: any, opts: CliOptions) {
  const commands = contributes?.commands || [];
  const commandType = getValuesDtsType(commands.map(s => s.command));
  const builtinType = getValuesDtsType([...new Set(opts.commands || [])]);
  if (!commandType && !builtinType) {
    return '';
  }

  return /* ts */ `  /**
   * 命令管理
   */
  export const commands: CommandManager;
  /**
   * 内置命令
   */
  export type BuiltinCommand = ${builtinType || 'undefined'};
  /**
   * package.json 自定义命令
   */
  export type UserCommand = ${commandType || 'undefined'};

  export interface CommandManager {
    /**
     * 注册一个指定id的命令，并关联一个自定义的函数
     */
    registerCommand: (id: UserCommand, handler: (result: any) => void) => Disposable;
    /**
     * 注册一个指定id的编辑器命令
     */
    registerTextEditorCommand: (id: UserCommand, handler: (result: TextEditor) => void) => Disposable;
    /**
     * 执行指定id的命令。除了插件扩展的命令外，还可以执行HBuilderX内置的命令，完整的内置命令列表可以通过HBuilderX的顶部菜单工具-自定义快捷键，然后在打开的配置文件左侧部门找到所有列出的command字段.
     */
    executeCommand: (id: BuiltinCommand | UserCommand) => void;
  }`;
};

function getViewCode(contributes: any) {
  const views = contributes?.views || {};
  const viewKeys = Object.keys(views);
  if (viewKeys.length === 0) {
    return '';
  }

  // 获取所有viewId
  const allViewIds = viewKeys.reduce((acc, cur) => {
    const ids = (views[cur] || []).map(view => view.id);
    return acc.concat(ids);
  }, [] as string[]);

  const containerViewIdCode = viewKeys.map((key) => {
    const viewIds = (views[key] || []).map(view => `'${view.id}'`).join(', ');
    return `    readonly ${key}: readonly [${viewIds}];`;
  }).join('\n');

  const allViewIdsCode = getValuesDtsType(allViewIds);
  if (!allViewIdsCode) {
    return '';
  }

  return /* ts */ `
  const containerToViews: {
${containerViewIdCode}
  };

  export type ContainerId = keyof typeof containerToViews;
  export type ViewId<C extends ContainerId = ContainerId> = typeof containerToViews[C][number];

  export interface ShowWebviewInfo<C extends ContainerId = ContainerId> {
    containerId: C;
    viewId: ViewId<C>;
  };

  /**
   * 视图id
   */
  export type UserViewId = ${allViewIdsCode};
  export interface WorkbenchWindow {
    /**
     * 创建指定viewId的视图，将会以tab的形式在左侧显示。viewId是在配置扩展点views中声明的id
     */
    createTreeView: (viewId: UserViewId, options: TreeViewOptions) => void;
    /**
     * 创建指定viewId的视图，将会以tab的形式在右侧显示。viewId是在配置扩展点views中声明的id。
     */
    createWebView: (viewId: UserViewId, options: WebViewOptions) => WebViewPanel;
    /**
     * 切换指定viewId的WebView控件视图。插件创建多个WebView视图并打开后，通过该接口切换视图区域中指定的tab页。该接口不适用于创建。
     */
    showView: <C extends ContainerId>(viewInfo: ShowWebviewInfo<C>) => void;
  }`;
}
