/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const provider1 = vscode.languages.registerCompletionItemProvider(['markdown', 'mdx'], {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			const snippets = [
				{
					title: "Docuo: Image",
					content: '<Frame width="${1|auto,300|}" height="${2|auto,300|}" caption="${3:image description text}">\n  <img src="${4:/path/image.jpg}" />\n</Frame>',
					desc: "Insert image"
				},
				{
					title: "Docuo: Vide",
					content: '<Video src="${1:https://youtube.com/xxxxxx}"/>					',
					desc: "Insert online video"
				},
				{
					title: "Docuo: Tip",
					content: '<Tip title="${1:Tip}">${2:This suggests a helpful tip}</Tip>',
					desc: "Insert tip component"
				},
				{
					title: "Docuo: Note",
					content: '<Note title="${1:Note}">${2:This adds a note in the content}</Note>',
					desc: "Insert note component"
				},
				{
					title: "Docuo: Warning",
					content: '<Warning title="${1:Warning}">${2:This raises a warning to watch out for}</Warning>',
					desc: "Insert warning component"
				},
				{
					title: "Docuo: Error",
					content: '<Error title="${1:Error}">${2:This raises a error to watch out for}</Error>',
					desc: "Insert error component"
				},
				{
					title: "Docuo: Code block",
					content: '```${1|js,c++,java|}\n${2:helloWorld();}\n```',
					desc: "Insert simple code block"
				},
				{
					title: "Docuo: Code block with file name",
					content: '```${1|js,c++,java|} ${2:fiename}\n${3:helloWorld();}\n```',
					desc: "Insert code block with file name"
				},
				{
					title: "Docuo: Code block with highlighting",
					content: '```${1|js,c++,java|} ${2:fiename} {${3|1,1-3|}}\n${4:helloWorld();}\n```',
					desc: "Insert code block with file name and highligiting specific lines"
				},
				{
					title: "Docuo: Code group",
					content: '<CodeGroup>\n```${1|js,c++,java|} ${2:filename}\n${3:firstCodeBlock();}\n```\n\n```${4|js,c++,java|} ${5:filename}\n${6:secondCodeBlock();}\n```\n</CodeGroup>',
					desc: "Use <CodeGroup> to aggregate multiple code blocks into one code group."
				}
			];
			const snippetCompletions = [];
			for (let i = 0; i < snippets.length; i++) {
				snippetCompletions.push(createSnippetCompletion(snippets[i]));
			}

			// return all completion items as array
			return snippetCompletions;
		}
	});

	const disposable = vscode.commands.registerCommand('docuo.frontmatter', () => {
        if (vscode.window.activeTextEditor) {
            const editor = vscode.window.activeTextEditor;
            const document = editor.document;

            editor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(0, 0), '---\ntitle: Title of the doc\ndescription: Description of the doc\n---\n');
            });
        }
    });

	context.subscriptions.push(provider1, disposable);
}
function createSnippetCompletion(snippet: any) {
	const snippetCompletion = new vscode.CompletionItem(snippet.title, 14);
	snippetCompletion.insertText = new vscode.SnippetString(snippet.content);
	const docs: any = new vscode.MarkdownString(`${snippet.desc}  [read doc](docs-components).`);
	snippetCompletion.documentation = docs;
	docs.baseUri = vscode.Uri.parse('https://docuo.spreading.io/editing-docs/');
	return snippetCompletion;
}