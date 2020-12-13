
import vscode = require('vscode');
import kill = require('tree-kill');

export function getGoConfig(uri?: vscode.Uri): vscode.WorkspaceConfiguration {
	if (!uri) {
		if (vscode.window.activeTextEditor) {
			return vscode.workspace.getConfiguration('goctl', uri);
		} else {
			return vscode.workspace.getConfiguration('goctl', null);
		}
	}
	return vscode.workspace.getConfiguration('goctl', null);
}


export const killTree = (processId: number): void => {
	kill(processId, (err) => {
		if (err) {
			console.log('Error killing process tree: ' + err);
		}
	});
};