import * as vscode from 'vscode';

enum CodeLineType {
	Type,
	InType,
	Url,
	None
}


function REX_TYPE(target: string): string {
	return `(|type)\\s*\\b${target}\\b\\s*(|struct)\\s*\\{`;
}

function REX_IN_TYPE(target: string): string {
	return `(|\\*|\\[\\]|\\[\\]\\*)\\b${target}\\b\\s*\`(json|form|path)`;
}

function REX_URL_RETURN(target: string): string {
	return `returns\\s*\\(\\s*\\b${target}\\b\\s*\\)`;
}

function REX_URL_METHOD(target: string): string {
	return `\\(\\s*\\b${target}\\b\\s*\\)`;
}

export class GoctlDefinitionProvider implements vscode.DefinitionProvider {
	provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Location | vscode.Location[] | vscode.LocationLink[]> {

		const word = document.getText(document.getWordRangeAtPosition(position));

		const apiDoc = document.getText();

		const line = document.lineAt(position.line).text;
		const lineType = matchLineTypeDefinition(line, word);

		switch (lineType) {
			case CodeLineType.Type:
				return this.findInTypeDefinitionAndUrl(document, word, position.line);
			case CodeLineType.InType:
				return this.findTypeAndUrlDefinition(document, word, position.line);
			case CodeLineType.Url:
				return this.findTypeDefinition(document, word, position.line);
			case CodeLineType.None:
				return null;
			default:
				console.log("code line type don't matched");
				return null;
		}
	}

	private findTypeDefinition(document: vscode.TextDocument, target: string, targetLineNum: number): vscode.ProviderResult<vscode.Location[]> {

		let locations: vscode.Location[] = [];

		const docData = document.getText();
		const lines = docData.split('\n');
		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			if (lineIndex === targetLineNum) {
				continue;
			}
			const line = lines[lineIndex];
			// type
			const messageDefinitionRegexMatch = new RegExp(REX_TYPE(target)).exec(line);
			if (messageDefinitionRegexMatch && messageDefinitionRegexMatch.length) {
				const range = this.getTargetLocationInline(lineIndex, line, target, messageDefinitionRegexMatch);
				locations.push(new vscode.Location(document.uri, range));
			}
		}
		return locations;
	}


	private findInTypeDefinitionAndUrl(document: vscode.TextDocument, target: string, targetLineNum: number): vscode.ProviderResult<vscode.Location[]> {
		let locations: vscode.Location[] = [];

		const docData = document.getText();
		const lines = docData.split('\n');
		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			if (lineIndex === targetLineNum) {
				continue;
			}
			const line = lines[lineIndex];
			// intype
			const messageDefinitionRegexMatch = new RegExp(REX_IN_TYPE(target)).exec(line);
			if (messageDefinitionRegexMatch && messageDefinitionRegexMatch.length) {
				const range = this.getTargetLocationInline(lineIndex, line, target, messageDefinitionRegexMatch);
				locations.push(new vscode.Location(document.uri, range));
				continue;
			}
			// service request
			const requestMessageDefinitionRegexMatch = new RegExp(REX_URL_METHOD(target)).exec(line);
			if (requestMessageDefinitionRegexMatch && requestMessageDefinitionRegexMatch.length) {
				const range = this.getTargetLocationInline(lineIndex, line, target, requestMessageDefinitionRegexMatch);
				locations.push(new vscode.Location(document.uri, range));
				continue;
			}
			// service request
			const responseMessageDefinitionRegexMatch = new RegExp(REX_URL_RETURN(target)).exec(line);
			if (responseMessageDefinitionRegexMatch && responseMessageDefinitionRegexMatch.length) {
				const range = this.getTargetLocationInline(lineIndex, line, target, responseMessageDefinitionRegexMatch);
				locations.push(new vscode.Location(document.uri, range));
				continue;
			}
		}
		return locations;
	}
	private findTypeAndUrlDefinition(document: vscode.TextDocument, target: string, targetLineNum: number): vscode.ProviderResult<vscode.Location[]> {
		let locations: vscode.Location[] = [];

		const docData = document.getText();
		const lines = docData.split('\n');
		for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
			if (lineIndex === targetLineNum) {
				continue;
			}
			const line = lines[lineIndex];
			// type
			const messageDefinitionRegexMatch = new RegExp(REX_TYPE(target)).exec(line);
			if (messageDefinitionRegexMatch && messageDefinitionRegexMatch.length) {
				const range = this.getTargetLocationInline(lineIndex, line, target, messageDefinitionRegexMatch);
				locations.push(new vscode.Location(document.uri, range));
			}
			// service request
			const requestMessageDefinitionRegexMatch = new RegExp(REX_URL_METHOD(target)).exec(line);
			if (requestMessageDefinitionRegexMatch && requestMessageDefinitionRegexMatch.length) {
				const range = this.getTargetLocationInline(lineIndex, line, target, requestMessageDefinitionRegexMatch);
				locations.push(new vscode.Location(document.uri, range));
			}
			// service request
			const responseMessageDefinitionRegexMatch = new RegExp(REX_URL_RETURN(target)).exec(line);
			if (responseMessageDefinitionRegexMatch && responseMessageDefinitionRegexMatch.length) {
				const range = this.getTargetLocationInline(lineIndex, line, target, responseMessageDefinitionRegexMatch);
				locations.push(new vscode.Location(document.uri, range));
			}
		}
		return locations;
	}

	private getTargetLocationInline(lineIndex: number, line: string, target: string, definitionRegexMatch: RegExpExecArray): vscode.Range {

		const matchedStr = definitionRegexMatch[0];
		const index = line.indexOf(matchedStr) + matchedStr.indexOf(target);

		const definitionStartPosition = new vscode.Position(lineIndex, index);
		const definitionEndPosition = new vscode.Position(lineIndex, index + target.length);
		return new vscode.Range(definitionStartPosition, definitionEndPosition);
	}
}


function matchLineTypeDefinition(line: string, target: string): CodeLineType {

	if (line.match(REX_TYPE(target))) {
		return CodeLineType.Type;
	} else if ((line.match(REX_IN_TYPE(target)))) {
		return CodeLineType.InType;
	} else if (line.match(REX_URL_RETURN(target))) {
		return CodeLineType.Url;
	} else if (line.match(REX_URL_METHOD(target))) {
		return CodeLineType.Url;
	}
	return CodeLineType.None;
}