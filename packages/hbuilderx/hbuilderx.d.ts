/**
 * 复制自官方 HBuilderX 插件API定义文件，补全缺失定义，部分参数改为可选参数
 * /Applications/HBuilderX.app/Contents/HBuilderX/plugins/hbuilderx-language-services/builtin-dts/common/extension_js.d.ts
 */

/**
 * hbuilderx 插件API https://hx.dcloud.net.cn/ExtensionDocs/Api/README
 */
declare module 'hbuilderx' {
  /**
   * 当前激活的窗口
   */
  export const window: WorkbenchWindow;
  /**
   * 工作空间,包含所有的项目集,所有的窗口共享同一个工作空间.
   */
  export const workspace: Workspace;
  /**
   * 命令管理
   */
  export const commands: CommandManager;
  /**
   * 语言相关的操作
   */
  export const languages: LanguageManager;
  /**
   * env二级模块对象，包含运行环境信息和系统交互相关的方法
   */
  export const env: _Env;
  /**
   * 工作空间文档编辑
   */
  export const WorkspaceEdit: WorkspaceEdit;
  /**
   * 文本编辑
   */
  export const TextEdit: TextEdit;
  /**
   * TreeView树控件获取数据的接口
   */
  export const TreeDataProvider: TreeDataProvider;
  /**
   * Uri对象
   */
  export const Uri: Uri;
  /**
   * 自定义编辑器
   */
  export const CustomEditor: CustomEditor;
  /**
   * 插件授权登录
   */
  export const authorize: Authorize;

  /**
   * env二级模块对象，包含运行环境信息和系统交互相关的方法
   */
  interface _Env {
    /**
     * 应用程序名称：HBuilder X
     */
    appName: string;
    /**
     * 应用程序主版本号，可在菜单【帮助】-【关于】中查看
     */
    appVersion: string;
    /**
     * 应用程序安装路径
     */
    appRoot: string;
    /**
     * 应用程序数据存放路径
     */
    appData: string;
    /**
     * 剪切板对象，可用于读取剪切板内容和写入内容到剪切板，目前仅支持文本格式
     */
    clipboard: _Clipboard;
    /**
     * 打开一个外部链接，比如https://www.dcloud.io、mailto:ide@dcloud.io
     */
    openExternal: (uri: string) => Promise<boolean>;
  }

  /**
   * 剪切板对象，可用于读取剪切板内容和写入内容到剪切板，目前仅支持文本格式
   */
  interface _Clipboard {
    /**
     * 读取剪切板内容
     */
    readText: () => Promise<string>;
    /**
     * 写入内容到剪切板
     */
    writeText: (value: string) => Promise<void>;
  }

  interface UriHandler {
    handleUri: (result: Uri) => void;
  }

  interface ShowWebviewInfo {
    /**
     * 容器id
     */
    containerId: string;
    /**
     * 视图id
     */
    viewId: string;
  }

  interface WorkbenchWindow {
    /**
     * 注册一个schema处理器。schema调用格式为：hbuilderx://requestExtension/%extensionId%/foo/bar?param=foo&param2=bar 其中前缀hbuilderx://requestExtension/为必须内容,%extensionId%为要调用的插件id，后面为要传递给scheme的UriHandler内的其他参数信息。
     */
    registerUriHandler: (handler: UriHandler, context: ExtensionContext) => Disposable;
    /**
     * 设置状态栏消息
     */
    setStatusBarMessage: (text: string, hideAfterTimeout: number, level: string) => Disposable;
    /**
     * 清空状态栏消息
     */
    clearStatusBarMessage: () => Promise<void>;
    /**
     * 在窗口右下角显示错误消息
     */
    showErrorMessage: (message: string, buttons?: string[]) => Promise<string>;
    /**
     * 在窗口右下角显示普通消息
     */
    showInformationMessage: (message: string, buttons?: string[]) => Promise<string>;
    /**
     * 在窗口上显示普通消息
     */
    showMessageBox: (options: MessageBoxOptions) => Promise<string>;
    /**
     * 在窗口右下角显示警告消息
     */
    showWarningMessage: (message: string, buttons: string[]) => Promise<string>;
    /**
     * 在窗口中间弹出一个可搜索的建议选择列表
     */
    showQuickPick: (items: QuickPickItem[], options: QuickPickOptions) => Promise<QuickPickItem>;
    /**
     * 在窗口中间弹出一个输入框
     */
    showInputBox: (options: InputBoxOptions) => Promise<string>;
    /**
     * 获取当前激活的编辑器
     */
    getActiveTextEditor: () => Promise<TextEditor>;
    /**
     * 打开一个文档
     */
    openTextDocument: (uri: string | Uri) => Promise<TextEditor>;
    /**
     * 创建一个输出控制台
     */
    createOutputChannel: (channel: string) => OutputChannel;
    /**
     * 创建指定viewId的视图，将会以tab的形式在左侧显示。viewId是在配置扩展点views中声明的id
     */
    createTreeView: (viewId: string, options: TreeViewOptions) => void;
    /**
     * 创建指定viewId的视图，将会以tab的形式在右侧显示。viewId是在配置扩展点views中声明的id。
     */
    createWebView: (viewId: string, options: WebViewOptions) => WebViewPanel;
    /**
     * 切换指定viewId的WebView控件视图。插件创建多个WebView视图并打开后，通过该接口切换视图区域中指定的tab页。该接口不适用于创建。
     */
    showView: (viewInfo: ShowWebviewInfo) => void;
    /**
     * 注册指定类型的CustomEditorProvider，当打开匹配的文件时，在编辑器区域创建自定义编辑器标签卡。
     */
    registerCustomEditorProvider: (type: string, provider: CustomEditorProvider) => void;
    /**
     * 创建基于WebView页面的对话框，通过html渲染对话框的主要内容，可通过参数定制对话框标题、按钮等内容。
     */
    createWebViewDialog: (dialogOptions: DialogOptions, webviewOptions: WebViewOptions) => WebViewDialog;
    /**
     * 创建一个自定义的窗口, 可极大程度的自定义窗口.
     */
    showFormDialog: (options: FormDialogOptions) => Promise<FormDialogResult>;
  }

  interface FormDialogResult {
    /**
     * 窗口勾选取消或出现错误时, 返回的代码
     */
    code: number;
    /**
     * 窗口正常选择时, 返回的数据
     */
    data: any;
  }

  interface FormDialogOptions {
    /**
     * 窗口主标题
     */
    title: string;
    /**
     * 窗口副标题
     */
    subtitle: string;
    /**
     * 窗口底部文本
     */
    footer: string;
    /**
     * 隐藏副标题(未设置 subtitle 时自动隐藏)
     */
    hideSubTitle: boolean;
    /**
     * 隐藏错误提示
     */
    hideErrorLabel: boolean;
    /**
     * 隐藏底部分隔符
     */
    hideFooterSeparator: boolean;
    /**
     * 隐藏底部所有控件
     */
    hideFooter: boolean;
    /**
     * 窗口宽度, 可不设置, 默认值为 640
     */
    width: number;
    /**
     * 窗口高度, 可不设置, 默认值为 480
     */
    height: number;
    /**
     * 提交或上传按钮
     */
    submitButtonText: string;
    /**
     * 提交或上传按钮
     */
    acceptButtonText: string;
    /**
     * 取消按钮
     */
    cancelButtonText: string;
    /**
     * 取消按钮
     */
    rejectButtonText: string;
    /**
     * 窗口中的子控件
     */
    formItems: FormItemOptions[];
  }

  interface FormItemOptions {
    /**
     * formDialog中的子控件类型
     * - label: 标签卡
     * - input: 输入框
     * - fileSelectInput: 文件夹选择框
     * - radioGroup: 单选按钮组
     * - list: 列表控件
     * - checkBox: 复选框控件
     * - spaceList: 云服务空间列表
     */
    type: 'label' | 'input' | 'fileSelectInput' | 'radioGroup' | 'list' | 'checkBox' | 'spaceList';
    /**
     * 控件的唯一标识
     */
    name: string;
    /**
     * 文件输入框的模式
     * - file: 文件选择框
     * - folder: 文件夹选择框
     */
    mode: 'file' | 'folder';
    /**
     * label的描述文字
     */
    text: string;
    /**
     * 各个控件可设置的说明文字
     */
    label: string;
    /**
     * 输入框中没有文字时的提示文字
     */
    placeholder: string;
    /**
     * 列表外部存在一个 group, 这是 group 的标题
     */
    title: string;
    /**
     * 列表各个列的宽度比例
     */
    columnStretches: string;
    /**
     * 各个控件的值, 类型不定
     */
    value: any;
  }

  interface WebView {
    /**
     * 调用createWebView创建WebView时传入的options参数。
     */
    options: WebViewOptions;
    /**
     * WebView中要显示的html内容。
     */
    html: string;
    /**
     * 收到hbuilderx.postMessage发出的消息时调用回调函数。
     */
    onDidReceiveMessage: (callback: (result: any) => void) => void;
    /**
     * 将本地资源转换成可在WebView中加载的Uri。
     */
    asWebviewUri: (Uri: Uri) => Uri;
  }

  interface WebViewPanel {
    /**
     * 是否启用JavaScript脚本支持。
     */
    webView: WebView;
    /**
     * 调用关闭该扩展视图。
     */
    dispose: () => void;
    /**
     * 注册WebViewPanel视图关闭后的回调。
     */
    onDidDispose: (callback: (result: any) => void) => void;
  }

  interface WebViewOptions {
    /**
     * 是否启用JavaScript脚本支持。
     */
    enableScripts: boolean;
  }

  interface TreeViewOptions {
    /**
     * 是否显示折叠所有
     */
    showCollapseAll: boolean;
    /**
     * TreeView树控件获取数据的接口
     */
    treeDataProvider: TreeDataProvider;
  }

  interface TreeDataProvider {
    /**
     * 获取某个节点的下的子节点，如果参数为空，则表示要获取根节点
     */
    getChildren: (element: any) => any;
    /**
     * 获取用于显示自定义数据element(通过getChildren获取的对象)的TreeItem对象
     */
    getTreeItem: (element: any) => TreeItem;
  }

  interface TreeItem {
    /**
     * 是否可展开，目前取值有：0：不可展开；1：可展开
     */
    collapsibleState: number;
    /**
     * 该item的显示名称
     */
    label: string;
    /**
     * 该item的上下文信息，在通过menus扩展点的view/item/context类别注册右键菜单时，用when表达式中的viewItem变量控制菜单显示。举例：viewItem == 'test'
     */
    contextValue: string;
    /**
     * 当选中该item时要执行的命令
     */
    command: CommandInfo;
    /**
     * 鼠标悬浮到该item上的tooltip提示消息
     */
    tooltip: string;
  }

  interface CommandInfo {
    /**
     * 要执行的命令id
     */
    command: string;
    /**
     * 执行该命令时传递的参数
     */
    arguments: any[];
  }

  interface InputBoxOptions {
    /**
     * 输入框的描述
     */
    prompt: string;
    /**
     * 输入框的默认值
     */
    value: string;
    /**
     * 输入框内容为空时的占位内容
     */
    placeHolder: string;
    /**
     * 是否是密码框
     */
    password: boolean;
  }

  interface MessageBoxOptions {
    /**
     * 消息类型,取值有['warning'|'info'|'error'|'question']
     * - warning: 警告
     * - info: 信息
     * - error: 错误
     * - question: 问题
     *
     * @default "info"
     */
    type?: 'warning' | 'info' | 'error' | 'question';
    /**
     * 标题
     */
    title: string;
    /**
     * 内容
     */
    text: string;
    /**
     * 按钮列表
     */
    buttons?: string[];
    /**
     * 默认按钮索引
     * @default "0"
     */
    defaultButton?: string;
    /**
     * 默认Esc后执行的操作按钮索引
     * @default "1"
     */
    escapeButton?: string;
  }

  interface QuickPickOptions {
    /**
     * 搜索框为空时占位的文本
     */
    placeHolder: string;
  }

  interface QuickPickItem {
    /**
     * 候选项名称
     */
    label: string;
    /**
     * 候选项描述
     */
    description: string;
  }

  interface TextDocumentWillSaveEvent {
    /**
     * 该事件关联的文档
     */
    document: TextDocument;
  }

  interface TextDocumentChangeEvent {
    /**
     * 该事件关联的文档
     */
    document: TextDocument;
  }

  interface TextDocument {
    /**
     * 文档名称
     */
    fileName: string;
    /**
     * 是否是修改状态
     */
    isDirty: boolean;
    /**
     * 是否是无标题文件
     */
    isUntitled: boolean;
    /**
     * 编程语言Id
     */
    languageId: string;
    /**
     * 文档总行数
     */
    lineCount: number;
    /**
     * 文档的uri，如果是本地文件，可通过uri.fsPath获取本地文件路径
     */
    uri: Uri;
    /**
     * 该文档文件所属的项目对象
     */
    workspaceFolder: WorkspaceFolder;
    /**
     * 获取指定区域内的文本
     */
    getText: (range: IRange) => string;
    /**
     * 获取指定的行信息
     */
    lineAt: (lineNum: number) => Promise<TextLine>;
    /**
     * 根据光标位置获取光标所在行。
     */
    lineFromPosition: (pos: number) => Promise<TextLine>;
  }

  interface TextLine {
    /**
     * 行起始位置
     */
    start: number;
    /**
     * 行结束位置，不计算换行符
     */
    end: number;
    /**
     * 行内容，不包含换行符
     */
    text: string;
  }

  interface IRange {
    /**
     * 开始位置
     */
    start: number;
    /**
     * 结束位置
     */
    end: number;
  }

  interface TextEditor {
    /**
     * 当前光标选中的位置
     */
    selection: Selection;
    /**
     * 当前多光标选中的位置集合
     */
    selections: Selection[];
    /**
     * 该编辑器关联的文档
     */
    document: TextDocument;
    /**
     * 该编辑器的设置
     */
    options: any;
    // TODO: https://hx.dcloud.net.cn/ExtensionDocs/Api/windows/TextEditor?id=texteditor%e5%b1%9e%e6%80%a7%e5%88%97%e8%a1%a8
    // options: TextEditorOptions;
    /**
     * 修改当前编辑器打开的文档
     */
    edit: (callback: (result: TextEditorEdit) => void) => Promise<void>;
    /**
     * 设置主光标区域，该API会首先清除原来的光标选择，如果要使用多光标，请使用addSelection方法
     */
    setSelection: (active: number, anchor: number) => Promise<void>;
    /**
     * 增加新的光标区域，调用后会在编辑器内追加一个新一个光标。
     */
    addSelection: (active: number, anchor: number) => Promise<void>;
  }

  interface TextEditorEdit {
    /**
     * 删除指定范围的字符串
     */
    delete: (range: IRange) => any;
    /**
     * 在指定位置插入字符串
     */
    insert: (pos: number, value: string) => any;
    /**
     * 替换指定范围的字符串
     */
    replace: (range: IRange, value: string) => any;
  }

  interface OutputChannel {
    /**
     * 通道名称
     */
    name: string;
    /**
     * 输出新的一行
     */
    appendLine: (line: string) => Promise<void>;
    /**
     * 显示该输出控制台
     */
    show: () => Promise<void>;
  }

  interface Workspace {
    /**
     * 获取项目管理器下所有的项目对象（不包含已关闭项目）
     */
    getWorkspaceFolders: () => WorkspaceFolder[];
    /**
     * 获取某个文件所在的项目
     */
    getWorkspaceFolder: (uri: string | Uri) => Promise<WorkspaceFolder>;
    /**
     * 全局配置改变事件，比如"editor.fontSize"改变，或者通过插件扩展的配置项改变。
     */
    onDidChangeConfiguration: (listener: (result: ConfigurationChangeEvent) => void) => Disposable;
    /**
     * 项目管理器内的项目新增或者移除时产生的事件
     */
    onDidChangeWorkspaceFolders: (listener: (result: WorkspaceFoldersChangeEvent) => void) => Disposable;
    /**
     * 文档即将要保存的事件,注意该事件是同步调用,会阻塞用户界面.
     */
    onWillSaveTextDocument: (listener: (result: TextDocumentWillSaveEvent) => void) => Disposable;
    /**
     * 文档被修改时的事件
     */
    onDidChangeTextDocument: (listener: (result: TextDocumentChangeEvent) => void) => Disposable;
    /**
     * 文档被保存时的事件,触发时机是在文档保存后.
     */
    onDidSaveTextDocument: (listener: (result: TextDocument) => void) => Disposable;
    /**
     * 文档被打开时的事件
     */
    onDidOpenTextDocument: (listener: (result: TextDocument) => void) => Disposable;
    /**
     * 通过指定的uri打开一个文档文件
     */
    openTextDocument: (uri: string | Uri) => Promise<TextDocument>;
    /**
     * 根据指定的文档uri编辑已打开的文档。
     */
    applyEdit: (edit: WorkspaceEdit) => Promise<void>;
    /**
     * 根据指定的section获取对应的配置
     */
    getConfiguration: (section?: string) => Configuration;
    /**
     * 根据指定文件位置文件进行文件拷贝操作
     */
    copyFileWithPrompt: (options: CopyFileWithPromptOptions) => Promise<string>;
    /**
     * 配置代码块可打印最近变量
     */
    registerSnippetVariableResolver: (nearestVar: string, callback: () => void) => string;
  }

  /**
   * 全局配置对象
   */
  interface Configuration {
    /**
     * 根据指定的section获取配置项的值
     */
    get: (section: string, defaultValue?: string | number | boolean) => string;
    /**
     * 更新指定section的配置项
     */
    update: (section: string, value: string | number | boolean) => Promise<void>;
  }

  interface CommandManager {
    /**
     * 注册一个指定id的命令，并关联一个自定义的函数
     */
    registerCommand: (id: string, handler: (result: any) => void) => Disposable;
    /**
     * 注册一个指定id的编辑器命令
     */
    registerTextEditorCommand: (id: string, handler: (result: TextEditor) => void) => Disposable;
    /**
     * 执行指定id的命令。除了插件扩展的命令外，还可以执行HBuilderX内置的命令，完整的内置命令列表可以通过HBuilderX的顶部菜单工具-自定义快捷键，然后在打开的配置文件左侧部门找到所有列出的command字段.
     */
    executeCommand: (id: string) => void;
  }

  interface LanguageManager {
    /**
     * 创建一个问题列表
     */
    createDiagnosticCollection: (name: string) => DiagnosticCollection;
  }

  interface DiagnosticCollection {
    /**
     * 问题集合名称
     */
    name: string;
    /**
     * 将问题列表设置到指定文档uri中,列表为空代表清空已有的问题列表
     */
    set: (uri: string | Uri, diagnostics: DiagnosticItem[]) => Promise<void>;
  }

  /**
   * 问题项
   */
  interface DiagnosticItem {
    /**
     * 在文档第几行
     */
    line: number;
    /**
     * 在文档第几列
     */
    column: number;
    /**
     * 问题详细信息
     */
    message: string;
    /**
     * 问题级别，取值范围:'error'，'warn'. 默认值是'error'
     */
    severity: string;
  }

  interface WorkspaceEdit {
    /**
     * 设置指定文档uri的编辑操作列表
     */
    set: (uri: string | Uri, edits: TextEdit[]) => Promise<void>;
  }

  interface TextEdit {
    /**
     * 要修改的区域
     */
    range: IRange;
    /**
     * 要插入的新内容
     */
    newText: string;
    /**
     * 静态方法, 生成replace的TextEdit对象
     */
    replace: (range: IRange, newText: string) => TextEdit;
  }

  interface WorkspaceFolder {
    /**
     * 项目目录文件地址
     */
    uri: Uri;
    /**
     * 项目目录名称
     */
    name: string;
    /**
     * 项目类型
     */
    nature: string;
    /**
     * 项目唯一id
     */
    id: string;
  }

  /**
   * 文件拷贝数据说明
   */
  interface CopyFileWithPromptOptions {
    /**
     * 拷贝文件源地址
     */
    src: Uri;
    /**
     * 拷贝文件目标地址
     */
    dest: Uri;
    /**
     * 目标文件一级目录存在时提示语
     */
    rootPromptTips: string;
    /**
     * 目标文件一级目录下的文件存在时提示语
     */
    filePromptTips: string;
    /**
     * 当前正在操作的文件回调
     */
    filter: (result: Uri) => void;
    /**
     * 操作错误的文件回调, 返回0 取消操作  返回 1  重试  返回 2 跳过
     */
    errorHandler: (result: Uri) => void;
  }

  interface ConfigurationChangeEvent {
    /**
     * 判断该事件该变了哪个配置项值
     */
    affectsConfiguration: (section: string) => boolean;
  }

  interface WorkspaceFoldersChangeEvent {
    /**
     * 新增的项目列表
     */
    added: WorkspaceFolder[];
    /**
     * 移除的项目列表
     */
    removed: WorkspaceFolder[];
  }

  interface Uri {
    /**
     * 本地文件地址
     */
    fsPath: string;
    authority: string;
    fragment: string;
    path: string;
    query: string;
    scheme: string;
  }

  interface CustomEditor {
    /**
     * 自定义文档，用于自定义编辑器。
     */
    CustomDocument: CustomDocument;
    /**
     * 自定义编辑器数据提供接口，需要继承实现必要接口。
     */
    CustomEditorProvider: CustomEditorProvider;
    /**
     * 自定义编辑器修改事件，向HBuilderX主动发送
     */
    CustomDocumentEditEvent: any;
    // TODO https://hx.dcloud.net.cn/ExtensionDocs/Api/windows/registerCustomEditorProvider?id=customdocumenteditevent
    // CustomDocumentEditEvent: CustomDocumentEditEvent;
  }

  interface CustomDocument {
    /**
     * 文件路径
     */
    uri: string;
  }

  interface CustomEditorProvider {
    /**
     * 用于触发文件变化事件，编辑器置为未保存状态
     */
    onDidChangeCustomDocument: EventEmitter;
    /**
     * 当用户打开匹配的文件时，由HBuilderX调用，创建并返回CustomDocument
     */
    openCustomDocument: (uri: string) => Promise<any>;
    /**
     * HBuilderX创建WebViewPanel并与document关联后调用该方法
     */
    resolveCustomEditor: (document: CustomDocument, webViewPanel: WebViewPanel) => void;
    /**
     * 用户执行“保存”操作时，HBuilderX调用该方法
     */
    saveCustomDocument: (document: CustomDocument) => Promise<void>;
    /**
     * 用户执行“另存为”操作时，HBuilderX调用该方法
     */
    saveCustomDocumentAs: (document: CustomDocument, destination: string) => Promise<void>;
  }

  interface EventEmitter {
    /**
     * 向订阅者发送事件
     */
    fire: (event: any) => void;
  }

  interface AuthorizeLoginResult {
    /**
     * CODE码，有效期5分钟。用于插件作者服务器端换取accessToken，通过accessToken换取授权的基本信息
     */
    code: string;
    /**
     * code获取失败时的错误码
     */
    error: number;
  }

  interface Authorize {
    /**
     * 向HBuilderX请求获取当前登录的用户信息授权
     */
    login: (args: any) => Promise<AuthorizeLoginResult>;
    /**
     * 注册HBuidlerX用户登录的事件回调
     */
    onUserLogin: (callback: (result: any) => void) => Disposable;
    /**
     * 注册HBuidlerX用户退出登录的事件回调
     */
    onUserLogout: (callback: (result: any) => void) => Disposable;
  }

  interface WebViewDialog {
    /**
     * 对话框WebView视图区域，用于渲染对话框主要内容
     */
    webView: WebView;
    /**
     * 用于内部通信的对话框id
     */
    id: string;
    /**
     * 显示对话框，返回显示成功或者失败的信息，主要包含内置浏览器相关状态。
     */
    show: () => Promise<{
      /**
       * - 0: 无错误
       * - 1: 内置浏览器插件正在下载
       * - 2: 内置浏览器插件不存在（弹出下载内置浏览器插件窗口，用户点击了取消）
       */
      code: 0 | 1 | 2;
      message: string;
    }>;
    /**
     * 关闭对话框
     */
    close: () => void;
    /**
     * 在对话框副标题下方显示红色错误信息
     */
    displayError: (text: string) => void;
    /**
     * 设置对话框指定按钮状态
     */
    setButtonStatus: (button: string, status: ('loading' | 'disabled')[]) => void;
    /**
     * 在对话框副标题下方显示红色错误信息
     */
    onDialogClosed: (callback: (result: any) => void) => Disposable;
  }

}

declare module 'hbuilderx' {
  // #region ExtensionContext

  /**
   * 插件上下文
   */
  interface ExtensionContext {

    /**
     * 一个可以添加可释放对象的数组。当此插件停用时，可释放对象将被释放。
     */
    readonly subscriptions: Disposable[];

    /**
     * 释放此插件上下文所占用的资源。
     */
    dispose: () => any;

    /**
     * 工作区状态存储对象
     */
    readonly workspaceState: Memento;

    /**
     * 全局状态存储对象
     */
    readonly globalState: Memento;

    /**
     * 当前插件目录的 URI
     */
    readonly extensionUri: Uri;

    /**
     * 当前插件目录的本地文件路径 {@link TextDocument.uri ExtensionContext.extensionUri.fsPath}
     */
    readonly extensionPath: string;

    /**
     * 获取插件中包含的资源的绝对路径
     *
     * @param relativePath 插件中包含的资源的相对路径
     * @returns 资源的绝对路径
     */
    asAbsolutePath: (relativePath: string) => string;

    /**
     * 插件用于存储全局状态的目录的 URI。
     *
     * 使用 {@linkcode ExtensionContext.globalState globalState} 存储键值数据
     */
    readonly globalStorageUri: Uri;

    /**
     * 插件可以存储全局状态的绝对文件路径
     *
     * 使用 {@linkcode ExtensionContext.globalState globalState} 存储键值数据
     *
     */
    readonly globalStoragePath: string;

    /**
     * 插件的运行模式. 请参阅 {@link ExtensionMode} 以获取更多信息.
     */
    readonly extensionMode: ExtensionMode;
  }

  /**
   * 存储状态
   */
  interface Memento {
    /**
     * 存储状态
     */
    state: Record<string, any>;

    /**
     * 获取存储的值
     *
     * @param key 键
     * @param defaultValue 默认值
     * @returns 存储的值或默认值
     */
    get: (<T>(key: string) => T | undefined) & (<T>(key: string, defaultValue: T) => T);

    /**
     * 存储一个值。该值必须是 JSON 可序列化的。
     *
     * 注意：使用 `undefined` 作为值会从底层存储中移除该键。
     *
     * @param key  键
     * @param value 可序列化的值
     */
    update: (key: string, value: any) => Promise<void>;
  }

  /**
   * 插件运行模式
   */
  enum ExtensionMode {
    /**
     * 插件正常安装
     */
    Production = 1,

    /**
     * 开发模式运行插件
     */
    Development = 2,

    /**
     * 测试模式运行插件
     */
    Test = 3,
  }

  // #endregion

  interface DialogOptions {
    /**
     * 是否显示为模态窗口，默认模态窗口
     * @default true
     */
    modal?: boolean;
    /**
     * 对话框主标题
     */
    title?: string;
    /**
     * 对话框副标题
     */
    description?: string;
    /**
     * 对话框按钮
     */
    dialogButtons?: string[];
    /**
     * 对话框尺寸
     */
    size?: {
      /**
       * 宽度
       */
      width?: number;
      /**
       * 高度
       */
      height?: number;
    };
  }
}
