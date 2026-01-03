import type { ExtensionContext } from 'hbuilderx';
import { setContext } from './ctx';

export * from './constants';
export * from './ctx';

/**
 * 初始插件
 * @param {ExtensionContext} ctx 插件上下文
 */
export function initExtension(ctx: ExtensionContext) {
  setContext(ctx);
}

export default {};
