# 后台管理
=========

## 技术栈
- react
- dva
- antd
- styled
- rxjs
- apollo

## 开发新功能模块的文件角色：
一般有3个文件分别是
- MyFeature.page.tsx         组件：负责表现层（多用生命周期，少用Promise）
- MyFeature.field.tsx   实体：负责表格字段属性（格式化、控件、表单验证）
- MyFeature.edit.tsx    表单：弹出用于编辑/创建的表单
- MyFeature.model.ts    模型：负责共享状态管理（同步异步更新）


## 目录结构
```
.
├── _templates      hygen 模板定义
├── config          webpack/jest/tslint 配置
├── scripts         webpack cli 脚本
├── server          服务器端
├── src             源代码
│   ├── assets      资源目录，用于源代码 import
│   ├── locale      语言包
│   ├── pages       业务模块
│   └── utils       工具方法
├── typings         类型声明
└── view            资源目录，用于link img的src
```

## 子模块
```
### 创建子模块
git submodule add https://git.henrizi.com/zlg/zongzi.git src/zongzi
```
### 克隆带子模块的项目
```
git clone --recursive
```
### 更新子模块
```
git submodule update --init
```
### 删除子模块
```
rm -rf src/zongzi
git rm -r --cached src/zongzi
.git/config
```
