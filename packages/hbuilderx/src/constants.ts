import { env } from 'hbuilderx';

/**
 * 当前 HBuilderX 是否是 alpha 版本
 */
export const isAlphaVersion = env.appVersion.endsWith('-alpha');
