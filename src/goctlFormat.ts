import * as vscode from 'vscode';
import cp = require('child_process');
import * as util from './util';
import { goctlOutputChannel } from './extension';

export class GoctlDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {

	coll = vscode.languages.createDiagnosticCollection(
		vscode.window.activeTextEditor?.document.fileName
	);

	provideDocumentFormattingEdits(
		document: vscode.TextDocument,
		options: vscode.FormattingOptions,
		token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {

		return this.runFormatter(document, token).then(
			(edits) => edits,
			(err) => {
				if (err) {
					let errs = err.split('\n');
					errs.forEach((element: string) => {
						if (element.trim().length === 0) {
							return;
						}

						const errObj = this.createDiagnostic(document, element);
						const diagnostics: vscode.Diagnostic[] = [];

						const hasErr = this.coll.get(document.uri);
						if (hasErr) {
							this.coll.get(document.uri)?.forEach((item) => {
								if (item.message === errObj.message) {
									return;
								} else {
									if (item.range.start.line === errObj.range.start.line) {
										return;
									}
								}
							});
						}
						diagnostics.push(errObj);
						this.coll.set(document.uri, diagnostics);
					});
					return Promise.reject();
				}
			}
		);
	}

	private runFormatter(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): Thenable<vscode.TextEdit[]> {

		const formatFlags = ['api', 'format', '-iu', '-dir', document.fileName, '--stdin'];
		return new Promise<vscode.TextEdit[]>((resolve, reject) => {
			let stdout = '';
			let stderr = '';

			const p = cp.spawn("goctl", formatFlags);

			token.onCancellationRequested(() => !p.killed && util.killTree(p.pid));
			p.stdout.setEncoding('utf8');
			p.stdout.on('data', (data) => (stdout += data));
			p.stderr.on('data', (data) => (stderr += data));
			p.on('error', (err) => {
				if (!err) {
					vscode.window.showWarningMessage('Unknown mistake , please feedback.');
					return reject();
				}
				goctlOutputChannel.appendLine(err.toString());

				let errCode = (<any>err).code;

				switch (errCode) {
					case 'ENOENT': {
						vscode.window.showInformationMessage("If you don't have goctl installed, you can install it with the following this doc: \"https://github.com/zeromicro/go-zero#6-quick-start\"");
						vscode.window.showWarningMessage('Check the console in goctl when formatting. goctl seem not in your $PATH , please try in terminal.');
						break;
					}
					case 'EACCES': {
						vscode.window.showWarningMessage('Check the console in goctl when formatting. goctl seem no executable permissions, please try in terminal.');
						break;
					}
					default: {
						vscode.window.showWarningMessage(err.toString());
						break;
					}
				}
				return reject();
			});
			p.on('close', (code) => {
				if (code !== 0) {
					return reject(stderr);
				}

				// Return the complete file content in the edit.
				// VS Code will calculate minimal edits to be applied
				const fileStart = new vscode.Position(0, 0);
				const fileEnd = document.lineAt(document.lineCount - 1).range.end;
				const textEdits: vscode.TextEdit[] = [
					new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout)
				];

				this.coll.delete(document.uri);

				return resolve(textEdits);
			});
			if (p.pid) {
				p.stdin.end(document.getText());
			}
		});
	}

	createDiagnostic(doc: vscode.TextDocument, err: string): vscode.Diagnostic {
		let errArr = err.split(' ');
		let [line, charStart] = errArr[2].split(':');

		let source = errArr[0];
		let msg = errArr.splice(3).join(' ').trim();

		const lineNumber = parseInt(line) - 1;
		const text = doc.lineAt(lineNumber);
		const charNumber = text.text.trim().length;
		const range = new vscode.Range(
			new vscode.Position(lineNumber, parseInt(charStart) + 1),
			new vscode.Position(lineNumber, charNumber)
		);
		return {
			code: '',
			message: msg,
			range: range,
			severity: vscode.DiagnosticSeverity.Error,
			source: source,
		};
	}
}
