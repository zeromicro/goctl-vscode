import * as vscode from "vscode";
import { goctlOutputChannel } from "./extension";
import * as util from "./util";
import cp = require("child_process");

export class GoctlDocumentFormattingEditProvider
  implements vscode.DocumentFormattingEditProvider
{
  // 创建集合
  coll = vscode.languages.createDiagnosticCollection(
    vscode.window.activeTextEditor?.document.fileName
  );

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    document = document;
    token = token;
    options = options;
    return this.runFormatter(document, token).then(
      (edits) => edits,
      (err) => {
        if (err) {
          let errs = err.split("\n");
          errs.forEach((element: string) => {
            if (element.trim().length === 0) {
              return;
            }

            // 创建错误提示
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

            // vscode.window.showErrorMessage(element)
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
    const formatFlags = [
      "api",
      "format",
      "-iu",
      "-dir",
      document.fileName,
      "--stdin",
    ];
    return new Promise<vscode.TextEdit[]>((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      const p = cp.spawn("goctl", formatFlags);

      token.onCancellationRequested(() => !p.killed && util.killTree(p.pid));
      p.stdout.setEncoding("utf8");
      p.stdout.on("data", (data) => (stdout += data));
      p.stderr.on("data", (data) => (stderr += data));
      p.on("error", (err) => {
        if (!err) {
          vscode.window.showWarningMessage(
            "Unknown mistake , please feedback."
          );
          return reject();
        }
        goctlOutputChannel.appendLine(err.toString());

        let errCode = (<any>err).code;

        switch (errCode) {
          case "ENOENT": {
            // promptForMissingTool(formatTool);
            vscode.window.showInformationMessage(
              'If you don\'t have goctl installed, you can install it with the following this doc: "https://github.com/zeromicro/go-zero#6-quick-start"'
            );
            vscode.window.showWarningMessage(
              "Check the console in goctl when formatting. goctl seem not in your $PATH , please try in terminal."
            );
            break;
          }
          case "EACCES": {
            vscode.window.showWarningMessage(
              "Check the console in goctl when formatting. goctl seem no executable permissions, please try in terminal."
            );
            break;
          }
          default: {
            vscode.window.showWarningMessage(err.toString());
            break;
          }
        }
        return reject();
      });
      p.on("close", (code) => {
        if (code !== 0) {
          return reject(stderr);
        }

        // Return the complete file content in the edit.
        // VS Code will calculate minimal edits to be applied
        const fileStart = new vscode.Position(0, 0);
        const fileEnd = document.lineAt(document.lineCount - 1).range.end;
        const textEdits: vscode.TextEdit[] = [
          new vscode.TextEdit(new vscode.Range(fileStart, fileEnd), stdout),
        ];

        // const timeTaken = Date.now() - t0;
        // sendTelemetryEventForFormatting(formatTool, timeTaken);
        // if (timeTaken > 750) {
        // 	console.log(`Formatting took too long(${timeTaken}ms). Format On Save feature could be aborted.`);
        // }

        // 删除错误提示
        this.coll.delete(document.uri);

        return resolve(textEdits);
      });
      if (p.pid) {
        p.stdin.end(document.getText());
      }
    });
  }

  // 创建
  createDiagnostic(doc: vscode.TextDocument, err: string): vscode.Diagnostic {
    let errArr = err.split(" ");
    let [line, charStart] = errArr[2].split(":");

    let source = errArr[0];
    let msg = errArr.splice(3).join(" ").trim();

    const lineNumber = parseInt(line) - 1;
    const text = doc.lineAt(lineNumber);
    const charNumber = text.text.trim().length;
    const range = new vscode.Range(
      new vscode.Position(lineNumber, parseInt(charStart) + 1),
      new vscode.Position(lineNumber, charNumber)
    );
    return {
      code: "",
      message: msg,
      range: range,
      severity: vscode.DiagnosticSeverity.Error,
      source: source,
      // relatedInformation: [
      //   new vscode.DiagnosticRelatedInformation(
      //     new vscode.Location(
      //       document.uri,
      //       new vscode.Range(
      //         new vscode.Position(parseInt(line), parseInt(char)),
      //         new vscode.Position(parseInt(line), parseInt(char))
      //       )
      //     ),
      //     "hello world"
      //   ),
      // ],
    };
  }
}
