import * as vscode from 'vscode';
import { GOCTL } from './goctlMode';
import { GoctlDocumentFormattingEditProvider } from './goctlFormat';
import { GoctlDefinitionProvider } from './goctlDeclaration';

export let goctlOutputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
	if (!goctlOutputChannel) {
		goctlOutputChannel = vscode.window.createOutputChannel('Goctl');
	}
	if (process.env.PATH) {
		goctlOutputChannel.appendLine("$PATH:" + process.env.PATH);
	}
	registerUsualProviders(context);
}

function registerUsualProviders(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDefinitionProvider(GOCTL, new GoctlDefinitionProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(GOCTL, new GoctlDocumentFormattingEditProvider()));
}