#!/usr/bin/env node

import type { CliOptions } from './types';
import meow from 'meow';
import { getConfig } from './config';
import { packExtension } from './pack';
import { logger, setOptions } from './util';
import { watchFiles } from './watch';

const cli = meow(`
Usage
  $ hx-cli [options] <dir>

  dir                   指定扩展目录，默认 "extension”

Options
  --watch, -w           监听 package.json，生产 d.ts 文件
  --pack, -p            生成插件打包文件
  --config              指定配置文件，如 "hx-cli.config.mjs"
  --verbose             显示更多信息
  --help, -h            显示帮助信息
  --version, -v         显示版本信息

Examples
  $ hx-cli --watch
  $ hx-cli --pack
`, {
  importMeta: import.meta,
  booleanDefault: undefined,
  helpIndent: 0,
  description: '生成 d.ts 文件和打包插件',
  flags: {
    watch: {
      type: 'boolean',
      shortFlag: 'w',
    },
    pack: {
      type: 'boolean',
      shortFlag: 'p',
    },
    verbose: {
      type: 'boolean',
      default: process.env.NODE_ENV === 'development',
    },
    help: {
      type: 'boolean',
      shortFlag: 'h',
    },
    version: {
      type: 'boolean',
      shortFlag: 'v',
    },
  },
});

const { input, flags } = cli;
if (flags.help) {
  cli.showHelp(0);
}
else if (flags.version) {
  cli.showVersion();
}
else {
  logger.enableDebug(flags.verbose);
  const cliOpts = Object.assign({ cwd: input[0] } as CliOptions, flags) as CliOptions;
  logger.debug('cli options:', cliOpts);

  const config = await getConfig(cliOpts);
  logger.debug('config options:', config);

  const opts = Object.assign({}, config, cliOpts) as CliOptions;
  opts.cwd || process.cwd();

  setOptions(opts);

  if (opts.watch) {
    await watchFiles(opts);
  }
  else if (opts.pack) {
    await packExtension(opts);
  }
  else {
    cli.showHelp(0);
  }
}
