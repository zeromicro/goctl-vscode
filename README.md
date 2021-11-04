# Goctl for Visual Studio Code

English | [简体中文](README-cn.md)

[![go-zero](https://img.shields.io/badge/Github-go--zero-brightgreen?logo=github)](https://github.com/zeromicro/go-zero)
[![license](https://img.shields.io/badge/License-MIT-blue)](https://github.com/zeromicro/goctl-vscode/blob/main/LICENSE)
[![Test](https://github.com/zeromicro/goctl-vscode/workflows/Test/badge.svg?branch=main)](https://github.com/zeromicro/goctl-vscode/actions?query=workflow%3ATest)

## Install

This plugin can be installed on Visual Studio Code version 1.46.0+. First make sure your version of Visual Studio Code meets the requirements and that the `goctl` command line tool is installed. If Visual Studio Code is not installed, please install and open Visual Studio Code. Navigate to the Extensions pane, search for `goctl` and install this extension (publisher ID is "xiaoxin- technology.goctl").

> Please refer to [here](https://code.visualstudio.com/docs/editor/extension-gallery) for Visual Studio Code extension usage.

**Note:** If the shell you are using is `fish`, the `$PATH` environment variable is configured in `fish`, which may cause the `$PATH` in vscode to be inconsistent with the `$PATH` in Terminal, please refer to: [PATH issues with Fish shell on macOS]( https://github.com/microsoft/vscode/issues/21655).

## Functions

Implemented functions

* Syntax highlighting
* Jump to definition/reference
* Code formatting
* Code block hinting

No implemented:

* Syntax error checking
* Cross-file code jumping

### Syntax Highlighting

### Code Jump

<p align=center>
<img src="docs/images/jump.gif" width=75%>
<br/>
<em>(Jump to definition/reference)</em>
</p>

### Code Format

The code formatting function will invoke the goctl command line formatting tool. Make sure goctl is added to `$PATH` and has executable permissions before using it.

### Code Block Hints

#### Info Code Block

<p align=center>
<img src="docs/images/info.gif" width=75%>
<br/>
<em>(Generate info code block)</em>
</p>

#### Type Code Block

<p align=center>
<img src="docs/images/type.gif" width=75%>
<br/>
<em>(Generate type code block)</em>
</p>

#### Service Code Block

<p align=center>
<img src="docs/images/service.gif" width=75%>
<br/>
<em>(Generate service code block)</em>
</p>

#### Handler Code Block

<p align=center>
<img src="docs/images/handler.gif" width=75%>
<br/>
<em>(Generate handler code block)</em>
</p>

## Feedback & Suggestions

If you encounter problems or have suggestions for improvement, please submit an issue by clicking [here](https://github.com/zeromicro/goctl-vscode/issues/new/choose).