import { Plugin, Editor, MarkdownView } from 'obsidian';
import Matrix from './matrix';
import Logger from './logging';

export default class LinearAlgebraTools extends Plugin {
	async onload() {
		this.addCommand({
			id: 'rref',
			name: 'RREF',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				Logger.debug('rref\n' + editor.getSelection());

				let arr: number[][] = editor
					.getSelection()
					.split('\n')
					.map((row) => row.split(' ').map((entry) => Number(entry)));

				let matrix: Matrix = new Matrix(arr);

				let result: string = `\\textrm{rref}\\left(${matrix.toLatex()}\\right)=`;

				matrix.rref();

				result += matrix.toLatex();
				editor.replaceSelection('$' + result + '$');
			},
		});

		this.addCommand({
			id: 'rref-steps',
			name: 'RREF (Show steps)',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				Logger.debug('rref-steps\n' + editor.getSelection());

				let arr: number[][] = editor
					.getSelection()
					.split('\n')
					.map((row) => row.split(' ').map((entry) => Number(entry)));

				let matrix: Matrix = new Matrix(arr);

				let ogMatrix: string = matrix.toLatex();

				let result: string = `$\\textrm{rref}\\left(${ogMatrix}\\right):$\n\n`;

				result += matrix.rref();

				result +=
					`$\\textrm{rref}\\left(${ogMatrix}\\right) ` +
					`= ${matrix.toLatex()}$\n`;

				editor.replaceSelection(result);
			},
		});

		this.addCommand({
			id: 'multiply',
			name: 'Multiply Matrices',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				Logger.debug('mutiply\n' + editor.getSelection());

				// Array containing both matrix arrays
				let arrs: number[][][] = editor
					.getSelection()
					.split('\n\n')
					.map((arrStr) =>
						arrStr
							.split('\n')
							.map((row) =>
								row.split(' ').map((entry) => Number(entry))
							)
					);

				let matrix: Matrix = new Matrix(arrs[0]);

				try {
					matrix.multiply(new Matrix(arrs[1]));
					editor.replaceSelection(`$${matrix.toLatex()}$`);
				} catch (e: any) {
					if (e.message) {
						editor.replaceSelection(e.message);
					}
				}
			},
		});
	}
}
