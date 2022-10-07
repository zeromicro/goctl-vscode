import * as vscode from "vscode";
import { GoctlDefinitionProvider } from "./goctlDeclaration";
import { GoctlDocumentFormattingEditProvider } from "./goctlFormat";
import { GOCTL } from "./goctlMode";

export let goctlOutputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
  if (!goctlOutputChannel) {
    goctlOutputChannel = vscode.window.createOutputChannel("Goctl");
  }
  if (process.env.PATH) {
    goctlOutputChannel.appendLine("$PATH:" + process.env.PATH);
  }

  registerUsualProviders(context);

  // 打开文件时，执行一次format
  if (vscode.window.activeTextEditor) {
    vscode.commands.executeCommand("editor.action.formatDocument");
  }
}

function registerUsualProviders(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      GOCTL,
      new GoctlDefinitionProvider()
    )
  );
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      GOCTL,
      new GoctlDocumentFormattingEditProvider()
    )
  );
}
