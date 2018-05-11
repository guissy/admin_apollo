# 项目规范
==========

## 公用文件：
1.配置文件未得允许不得修改
2.修改公用文件要测试好后及时push
3.公用组件要写好文档注释和类型声明

## 命名规范：大小驼峰
1.文件夹名：小驼峰
2.文件名：组件大驼峰 Component.tsx，后缀名为小写， Copoment.service.ts Copoment.model.ts
3.命名空间：model.ts 的 namespace 名为小驼峰
4.变量名：小驼峰
5.组件名、文件名、导入导出名要完全一致
6.事件名前缀 on, 如 onClick
7.组件名使用 UI 后缀，主要是区别 antd
8.组件外层div使用styled-components包装，名字Div，Section，Strong, Small, Span
9.测试文件要加 spec 后缀，如 abc.spec.ts
10.一个页面一个模块（即一个文件夹），模块要放在 src/pages 下，模块深度不要超过2层
11.注释格式：四字what: 长句解释 how 和 why

## git 操作：
1.每天上班第一件事是 pull 下班前的最后一件事 push
2.开发新功能要在新分支上开发，负责人合并到开发分支
3.修改文件夹名和文件大小写要建新分支改名
4.日志要严格按 [F]: Fixed: 修复具体bug [I]: Improved: 优化具体功能 [A] Added: 添加具体模块

## 类型声明：
1.除装饰器外，尽量不要使用 any
2.使用 any 一定得加 // tslint:disable-line:no-any
3.严格 null 检查，建议使用解构赋值+默认值来防null, 如 const { login = {} as LoginState } = this.props || { login: LoginState }
4.后端返回的数据要在 model.ts 写 export interface User {}

## 样式规范：
1.公用样式使用 scss 预处理
2.页面和组件样式使用 styled-components
3.尽量避免float, 如确实需要，一定要清理浮动，并写上注释为什么需要它
4.主要对 chrome firefox ie11 做兼容
5.除非重写第三方的行内样式，否则不可 !important
6.z-index: 要使用整百，不得写9999999，另外 antd 的弹出层均为1000

## 组件规范：
1.首选考虑公用组件，如项目中的公用表单，公用编辑框弹窗
2.优先使用 antd 的组件和属性，特别是可验证的 Form 表单
3.正确使用 antd 的 Col Row
4.行内样式不得超过1个
5.自定义的表单控件要适配 antd 规范，即 props 要有 value 和 onChange
6.a 链接 href 为空时，不用写 javascript:void(0)

## JS编程风格：
1.除了 null 和 undefined 判断外，其余使用 === 和 !==
2.尽量使用数组的 filter map reduce forEach include some 来代替 for while
3.避免标志数组 selectedId: [1,2,3]，而使用对象数组 [{id:1, selected: true}, {id:2, selected: true}, {id:3, selected: false}]
4.model.ts 中的 effects 的返回值要返回 interface Result { state: number; data: object | object[]; }
5.model.ts 中要保存页面表格数据的页码，即保存整个 attributes
6.utils 下工具类不能有引用 UI 组件，即使有UI也不能使用 tsx，要使用 React.createElement 等方法

## 项目附加
1.钱单位换算：moneyForResult + yuan 和 moneyForParam + fen (基于immutability-helper）
2.弹出消息：message.success/error 改用 messageForResult() + messageError
3.新增按钮使用 ButtonBar
4.表格的文字按钮(如不同数字文字)使用 TagButton
5.redux的 @connect 改用 @select
6.effects中的 call + put 改用 load
7.命名避免全小写, 例如 currentlanguagelist 没有拼写检写容易笔误
8.命名避免全大写，例如 HTTP 不如 Https， URL 不如 Url
9.避免魔法数字，例如 scrollHeight > 40 + 10


## 提交日志格式：
[C] Comment: 一般注释
[D] Docs: 修改了文档
[D] Release: 发布注释
[F] Fixed #2245: 修复一项 BUG
[A] Feature #1190: new feature added. 添加了一项新功能
[A] Added #2108: same as feature. 添加了一项新功能
[R] Removed #985: 移除
[D] Deprecated #1138: 一项功能过时/弃用
[I] Improved #186: 改进/提升
[X] Debug: 调试 /file/path:12
[-] Misc : 其它/杂项
[~] Initial.
