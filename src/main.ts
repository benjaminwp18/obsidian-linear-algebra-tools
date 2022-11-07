import {
	Plugin,
	renderMath,
	finishRenderMath,
	Editor,
	MarkdownView,
} from 'obsidian';
import Matrix from './matrix';

export default class LinearAlgebraTools extends Plugin {
	async onload() {
		this.addCommand({
			id: 'rref',
			name: 'RREF',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());

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
				console.log(editor.getSelection());

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
	}
}
