# Goctl for Visual Studio Code

[English](README.md) | 简体中文

[![go-zero](https://img.shields.io/badge/Github-go--zero-brightgreen?logo=github)](https://github.com/zeromicro/go-zero)
[![license](https://img.shields.io/badge/License-MIT-blue)](https://github.com/zeromicro/goctl-vscode/blob/main/LICENSE)
[![Test](https://github.com/zeromicro/goctl-vscode/workflows/Test/badge.svg?branch=main)](https://github.com/zeromicro/goctl-vscode/actions?query=workflow%3ATest)

## 安装此扩展

该插件可以安装在 1.46.0+ 版本的 Visual Studio Code 上，首先请确保你的 Visual Studio Code 版本符合要求，并已安装 goctl 命令行工具。如果尚未安装 Visual Studio Code，请安装并打开 Visual Studio Code。 导航到“扩展”窗格，搜索 `goctl` 并安装此扩展（发布者ID为 “xiaoxin-technology.goctl”）。

> Visual Studio Code 扩展使用请参考[这里](https://code.visualstudio.com/docs/editor/extension-gallery)。

**注意:** 如果你使用的 shell 是 `fish`，`$PATH`环境变量在 `fish` 中配置，可能会导致 vscode 中的 `$PATH` 和 Terminal 中的 `$PATH` 不一致，具体请参考：[PATH issues with Fish shell on macOS](https://github.com/microsoft/vscode/issues/21655)。

## 功能列表

已实现功能

* 语法高亮
* 跳转到定义/引用
* 代码格式化
* 代码块提示

未实现功能:

* 语法错误检查
* 跨文件代码跳转

### 语法高亮

### 代码跳转

<p align=center>
<img src="docs/images/jump.gif" width=75%>
<br/>
<em>(跳转到定义/引用)</em>
</p>

### 代码格式化

调用 goctl 命令行格式化工具，使用前请确认 goctl 已加入 `$PATH` 且有可执行权限。

### 代码块提示

#### info 代码块

<p align=center>
<img src="docs/images/info.gif" width=75%>
<br/>
<em>(生成 info 代码块)</em>
</p>

#### type 代码块

<p align=center>
<img src="docs/images/type.gif" width=75%>
<br/>
<em>(生成 type 代码块)</em>
</p>

#### service 代码块

<p align=center>
<img src="docs/images/service.gif" width=75%>
<br/>
<em>(生成 service 代码块)</em>
</p>

#### handler 代码块

<p align=center>
<img src="docs/images/handler.gif" width=75%>
<br/>
<em>(生成 handler 代码块)</em>
</p>

## 反馈与建议

如果你遇到了问题或者有改进建议，请点击[这里](https://github.com/zeromicro/goctl-vscode/issues/new/choose)提交 issue。