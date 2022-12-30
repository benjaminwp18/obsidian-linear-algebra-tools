import Logger from './logging';

export default class Matrix {
	array: number[][];
	doLogging: boolean;

	constructor(array: number[][], doLogging: boolean = false) {
		// Deep copy array to allow more Matrices to be constructed from it
		this.array = JSON.parse(JSON.stringify(array));
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

	/**
	 * Multiply this matrix by the provide matrix and store the result in
	 * 	this matrix
	 * @param matrix the matrix to multiply by
	 */
	multiply(matrix: Matrix) {
		if (matrix.numRows() != this.numCols())
			throw new Error(
				'Could not multiply matrices: Dimensions do not match!'
			);

		let result: number[][] = [];

		for (let r: number = 0; r < this.numRows(); r++) {
			result.push([]);
			for (let c: number = 0; c < matrix.numCols(); c++) {
				let row: number[] = this.getRow(r);
				let col: number[] = matrix.getCol(c);
				let sum: number = 0;

				for (let i: number = 0; i < row.length; i++) {
					sum += row[i] * col[i];
				}

				result[r].push(sum);
			}
		}

		this.array = result;
	}

	/**
	 * Store the reduced row echelon form of this matrix in this matrix and
	 * 	generate the steps required to do so
	 * @returns a Mathjax formatted string of steps to perform the RREF
	 */
	rref(): string {
		let steps: string = '';

		for (
			let pivot: { r: number; c: number } = { r: 0, c: 0 };
			pivot.r < this.numRows() && pivot.c < this.numCols();
			pivot.r++, pivot.c++
		) {
			// Find next nonzero entry to swap into the pivot position
			let row: number = pivot.r;
			while (this.array[row][pivot.c] == 0) {
				row++;
				if (row >= this.numRows()) {
					row = pivot.r;
					pivot.c++;

					// If no nonzero was found, we're done
					if (pivot.c >= this.numCols()) {
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
			for (row = 0; row < this.numRows(); row++) {
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

	/**
	 * Serialize this matrix with spaces between entries and newlines
	 * 	between rows
	 * @returns a string with the entries of this matrix, where entries are
	 * 				separated by spaces and rows by newlines
	 */
	toString(): string {
		return this.array.map((row) => row.join(' ')).join('\n');
	}

	/**
	 * Serialize this matrix as a LaTeX bmatrix
	 * @returns a string containing this matrix as a LaTeX bmatrix
	 */
	toLatex(): string {
		return (
			'\\begin{bmatrix}' +
			this.array.map((row) => row.join(' & ')).join(' \\\\ ') +
			'\\end{bmatrix}'
		);
	}

	/**
	 * Debug logs this matrix using the toString() method
	 */
	debugMatrix(): void {
		Logger.debug('\n' + this.toString());
	}

	/**
	 * @returns the number of rows in this matrix
	 */
	numRows(): number {
		return this.array.length;
	}

	/**
	 * @returns the number of columns in this matrix
	 */
	numCols(): number {
		return this.array[0].length;
	}

	/**
	 * Get the requested column as a one-dimensional array
	 * @param c the index of the column to get
	 * @returns a one-dimensional array of the requested column
	 */
	getCol(c: number): number[] {
		let result: number[] = [];

		for (let r = 0; r < this.numRows(); r++) {
			result.push(this.array[r][c]);
		}

		return result;
	}

	/**
	 * Get the requested row as a one-dimensional array
	 * @param r the index of the row to get
	 * @returns a one-dimensional array of the requested row
	 */
	getRow(r: number): number[] {
		return this.array[r];
	}

	/**
	 * Get the requested entry
	 * @param r the index of the row of the entry to get
	 * @param c the index of the column of the entry to get
	 * @returns the requested
	 */
	getEntry(r: number, c: number) {
		return this.array[r][c];
	}
}
