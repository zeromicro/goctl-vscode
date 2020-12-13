import * as vscode from 'vscode';
import cp = require('child_process');
import * as util from './util';

export class GoctlDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
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
						vscode.window.showErrorMessage(element);
					});
					return Promise.reject();
				}
			}
		);
	}

	private runFormatter(
		// formatTool: string,
		// formatFlags: string[],
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): Thenable<vscode.TextEdit[]> {

		const formatFlags = ['api', 'format', '-iu', '--stdin'];
		return new Promise<vscode.TextEdit[]>((resolve, reject) => {
			let stdout = '';
			let stderr = '';

			const p = cp.spawn("goctl", formatFlags);

			token.onCancellationRequested(() => !p.killed && util.killTree(p.pid));
			p.stdout.setEncoding('utf8');
			p.stdout.on('data', (data) => (stdout += data));
			p.stderr.on('data', (data) => (stderr += data));
			p.on('error', (err) => {
				if (err && (<any>err).code === 'ENOENT') {
					// promptForMissingTool(formatTool);
					vscode.window.showWarningMessage('Check the console in goctl when formatting. goctl seem not in your $PATH , please try in terminal.');
					return reject();
				}
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

				// const timeTaken = Date.now() - t0;
				// sendTelemetryEventForFormatting(formatTool, timeTaken);
				// if (timeTaken > 750) {
				// 	console.log(`Formatting took too long(${timeTaken}ms). Format On Save feature could be aborted.`);
				// }
				return resolve(textEdits);
			});
			if (p.pid) {
				p.stdin.end(document.getText());
			}
		});
	}
}
