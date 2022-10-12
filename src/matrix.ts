export default class Matrix {
    array: number[][]

    constructor(array: number[][]) {
        this.array = array;
    }

    /**
     * Swap 2 rows
     * @param row1 a row to swap
     * @param row2 a row to swap
     */
    swapRows(row1: number, row2: number) {
        console.debug(`Linear algebra tools: Swap ${row1} and ${row2}`);
        console.debug(`Linear algebra tools:\n${this.toString()}`);

        let tempRow: number[] = this.array[row1];

        this.array[row1] = this.array[row2];

        this.array[row2] = tempRow;

        console.debug(`Linear algebra tools:\n${this.toString()}`);
        console.debug(`Linear algebra tools: End swap`);
    }

    /**
     * Add a row scaled by a coefficient to another row: row1 + (coef) row2
     * @param row1 the row to modify
     * @param coef the coefficient of row2
     * @param row2 the row to add to row1
     */
    addRows(row1: number, coef: number, row2: number) {
        console.debug(`Linear algebra tools: Add ${row1} + (${coef}) ${row2}`);
        console.debug(`Linear algebra tools:\n${this.toString()}`);

        this.array[row2].forEach(
            (row2Entry, col) => this.array[row1][col] += coef * row2Entry);

        console.debug(`Linear algebra tools:\n${this.toString()}`);
        console.debug(`Linear algebra tools: End add`);
    }

    /**
     * Scale a row by the provided coefficient
     * @param row the row to scale
     * @param coef the coefficient to scale it by
     */
    scaleRow(row: number, coef: number) {
        console.debug(`Linear algebra tools: Scale ${row} by ${coef}`);
        console.debug(`Linear algebra tools:\n${this.toString()}`);

        this.array[row].forEach((_entry, col) => this.array[row][col] *= coef);

        console.debug(`Linear algebra tools:\n${this.toString()}`);
        console.debug(`Linear algebra tools: End scale`);
    }

    rref() {
        let steps: string[] = [];

        steps.push(`\\textrm{rref}\\left(${this.toLatex()}\\right):`);
        steps.push('br');
        steps.push('br');

        for (
            let pivot: { r: number, c: number } = { r: 0, c: 0 };
            pivot.r < this.array.length && pivot.c < this.array[0].length;
            pivot.r++, pivot.c++
        ) {
            // Find next nonzero entry to swap into the pivot position
            let row: number;
            for (row = pivot.r; row >= this.array.length || this.array[row][pivot.c] == 0; row++) {
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
                steps.push(`\\textrm{Swap\\:}R_{${row + 1}}\\textrm{\\:and\\:}R_{${pivot.r + 1}}`);
                steps.push('br');
                this.swapRows(row, pivot.r);
            }

            // Make the first nonzero entry of this row 1
            if (this.array[pivot.r][pivot.c] != 1) {
                steps.push(`R_{${pivot.r + 1}}:=\\left(\\frac{1}{${this
                    .array[pivot.r][pivot.c]}}\\right)R_{${pivot.r + 1}}`);
                steps.push('br');
                this.scaleRow(pivot.r, 1 / this.array[pivot.r][pivot.c]);
            }

            // Set other entries in this column to 0 with row addition
            for (row = 0; row < this.array.length; row++) {
                if (row != pivot.r && this.array[row][pivot.c] != 0) {
                    steps.push(`R_{${row + 1}}:=R_{${row + 1}}-(${this.array[row][pivot.c]})R_{${pivot.r + 1}}`);
                    steps.push('br');
                    this.addRows(row, -1 * this.array[row][pivot.c], pivot.r);
                }
            }

            // TODO: scale non-1s where there should be ones after you've finished main diagonal

            steps.push(this.toLatex());
            steps.push('br');
            steps.push('br');
        }

        return steps;
    }

    toString(): string {
        return this.array.map(row => row.join(' ')).join('\n');
    }

    toLatex(): string {
        return '\\begin{bmatrix}' +
            this.array.map(row => row.join(' & ')).join(' \\\\ ') +
            '\\end{bmatrix}';
    }
}