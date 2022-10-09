import { Plugin } from 'obsidian';

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor('rref', (source: string, el: HTMLElement, ctx: any) => {
			let arr: number[][] = source.split('\n')
				.map(row => row.split(' ').map(entry => Number(entry)));

			el.innerHTML = arr.map(row => row.join(',')).join(';');
		});
	}
}
