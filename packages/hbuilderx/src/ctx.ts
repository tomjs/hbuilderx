import type { ExtensionContext } from 'hbuilderx';

let _ctx!: ExtensionContext;

/**
 * 设置插件上下文对象
 */
export function setContext(ctx: ExtensionContext) {
  _ctx = ctx;
}

/**
 * 获取插件上下文对象
 */
export function getContext() {
  return _ctx;
}
