import { Plugin, renderMath, finishRenderMath } from 'obsidian';
import Matrix from './matrix';

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor('rref', (source: string, el: HTMLElement, ctx: any) => {
			let arr: number[][] = source.split('\n')
				.map(row => row.split(' ').map(entry => Number(entry)));

			let matrix: Matrix = new Matrix(arr);
			let steps: string[] = matrix.rref();

			el.innerHTML = '';
			steps.forEach(step => {
				if (step == 'br') el.appendChild(document.createElement('br'));
				else el.appendChild(renderMath(step, false));
			});
			finishRenderMath();
		});
	}
}
