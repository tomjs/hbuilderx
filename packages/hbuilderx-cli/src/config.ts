import type { CliOptions } from './types';
import fs from 'node:fs';
import { cosmiconfig } from 'cosmiconfig';

export async function getConfig(opts: CliOptions) {
  const explorer = cosmiconfig('hx-cli', {
    stopDir: opts.cwd,
    searchPlaces: [
      'package.json',
      'hx-cli.config.mjs',
      'hx-cli.config.js',
      'hx-cli.config.ts',
      'hx-cli.config.cjs',
    ],
  });

  if (opts.config) {
    if (!fs.existsSync(opts.config)) {
      return {};
    }

    const result = await explorer.load(opts.config);
    return result?.config || {};
  }

  const result = await explorer.search();
  return result?.config || {};
}
