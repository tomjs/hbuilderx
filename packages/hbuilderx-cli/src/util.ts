import type { CliOptions } from './types';
import Logger from '@tomjs/logger';
import { LOG_PREFIX } from './constant';

export const logger = new Logger({
  prefix: LOG_PREFIX,
  time: true,
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
