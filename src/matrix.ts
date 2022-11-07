import Logger from './logging';

export default class Matrix {
	array: number[][];
	doLogging: boolean;

	constructor(array: number[][], doLogging: boolean = false) {
		this.array = array;
		this.doLogging = doLogging;
	}

	/**
	 * Swap 2 rows
	 * @param row1 a row to swap
	 * @param row2 a row to swap
	 */
	swapRows(row1: number, row2: number) {
		if (this.doLogging) {
			Logger.debug(`Swap ${row1} and ${row2}`);
			this.debugMatrix();
		}

		let tempRow: number[] = this.array[row1];

		this.array[row1] = this.array[row2];

		this.array[row2] = tempRow;

		if (this.doLogging) {
			this.debugMatrix();
			Logger.debug('End swap');
		}
	}

	/**
	 * Add a row scaled by a coefficient to another row: row1 + (coef) row2
	 * @param row1 the row to modify
	 * @param coef the coefficient of row2
	 * @param row2 the row to add to row1
	 */
	addRows(row1: number, coef: number, row2: number) {
		if (this.doLogging) {
			Logger.debug(`Add ${row1} + (${coef}) ${row2}`);
			this.debugMatrix();
		}

		this.array[row2].forEach(
			(row2Entry, col) => (this.array[row1][col] += coef * row2Entry)
		);

		if (this.doLogging) {
			this.debugMatrix();
			Logger.debug('End add');
		}
	}

	/**
	 * Scale a row by the provided coefficient
	 * @param row the row to scale
	 * @param coef the coefficient to scale it by
	 */
	scaleRow(row: number, coef: number) {
		if (this.doLogging) {
			Logger.debug(`Scale ${row} by ${coef}`);
			this.debugMatrix();
		}

		this.array[row].forEach(
			(_entry, col) => (this.array[row][col] *= coef)
		);

		if (this.doLogging) {
			this.debugMatrix();
			Logger.debug('End scale');
		}
	}

	rref() {
		let steps: string = '';

		for (
			let pivot: { r: number; c: number } = { r: 0, c: 0 };
			pivot.r < this.array.length && pivot.c < this.array[0].length;
			pivot.r++, pivot.c++
		) {
			// Find next nonzero entry to swap into the pivot position
			let row: number = pivot.r;
			while (this.array[row][pivot.c] == 0) {
				row++;
				if (row >= this.array.length) {
					row = pivot.r;
					pivot.c++;

					// If no nonzero was found, we're done
					if (pivot.c >= this.array[0].length) {
						return steps;
					}
				}
			}

			// Swap nonzero entry to pivot position
			if (row != pivot.r) {
				steps += `$\\textrm{Swap\\:}R_{${
					row + 1
				}}\\textrm{\\:and\\:}R_{${pivot.r + 1}}$\n`;
				this.swapRows(row, pivot.r);
			}

			// Make the first nonzero entry of this row 1
			if (this.array[pivot.r][pivot.c] != 1) {
				steps += `$R_{${pivot.r + 1}}:=\\left(\\frac{1}{${
					this.array[pivot.r][pivot.c]
				}}\\right)R_{${pivot.r + 1}}$\n`;
				this.scaleRow(pivot.r, 1 / this.array[pivot.r][pivot.c]);
			}

			// Set other entries in this column to 0 with row addition
			for (row = 0; row < this.array.length; row++) {
				if (row != pivot.r && this.array[row][pivot.c] != 0) {
					steps += `$R_{${row + 1}}:=R_{${row + 1}}-(${
						this.array[row][pivot.c]
					})R_{${pivot.r + 1}}$\n`;
					this.addRows(row, -1 * this.array[row][pivot.c], pivot.r);
				}
			}

			steps += `$${this.toLatex()}$\n\n`;
		}

		return steps;
	}

	toString(): string {
		return this.array.map((row) => row.join(' ')).join('\n');
	}

	toLatex(): string {
		return (
			'\\begin{bmatrix}' +
			this.array.map((row) => row.join(' & ')).join(' \\\\ ') +
			'\\end{bmatrix}'
		);
	}

	debugMatrix(): void {
		Logger.debug('\n' + this.toString());
	}
}
