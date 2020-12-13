import * as vscode from 'vscode';
import { GOCTL } from './goctlMode';
import { GoctlDocumentFormattingEditProvider } from './goctlFormat';
import { GoctlDefinitionProvider } from './goctlDeclaration';

enum DocSegmentType {
	Type,
	Service,
	None
}

export function activate(context: vscode.ExtensionContext) {
	registerUsualProviders(context);
}

function registerUsualProviders(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDefinitionProvider(GOCTL, new GoctlDefinitionProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(GOCTL, new GoctlDocumentFormattingEditProvider()));
}