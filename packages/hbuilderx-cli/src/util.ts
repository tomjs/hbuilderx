import type { CliOptions } from './types';
import Logger from '@tomjs/logger';

export const logger = new Logger({
  directory: 'create-app/logs',
});

export const isWindows = process.platform === 'win32';

let _opts: CliOptions = {

};

export function setOptions(opts: CliOptions) {
  _opts = opts;
}

export function getOptions() {
  return _opts;
}
