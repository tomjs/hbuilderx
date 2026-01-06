/**
 * cli 参数
 */
export interface CliOptions {
  /**
   * 监听文件变化
   */
  watch?: boolean;
  /**
   * 打包插件，根据 package.json 中的 files 字段打包，如果未设置，默认取 dist,resources,package.json,LICENSE 文件夹或文件。
   */
  pack?: boolean;
  /**
   * 时间前缀
   */
  time?: boolean;
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
