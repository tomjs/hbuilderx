export interface CliOptions {
  /**
   * 监听文件变化
   */
  watch?: boolean;
  /**
   * 打包插件
   */
  pack?: boolean;
  /**
   * 打包插件文件，默认 dist、package.json、license
   */
  packFiles?: string[];
  /**
   * 当前工作目录/根目录
   */
  cwd?: string;
  /**
   * 配置文件
   */
  config?: string;
  /**
   * 生成 d.ts 文件路径
   * @default 'hbuilderx.d.ts'
   */
  dts?: string;
  /**
   * 添加到生成的 d.ts 中的命令，如用到的内置命令
   */
  commands?: string[];
  /**
   * verbose 模式
   * @default false
   */
  verbose?: boolean;
}
