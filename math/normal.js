export default class NormalForm {
    constructor(matrix) {
        Object.defineProperty(this, "matrix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // Original matrix
        Object.defineProperty(this, "D", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // Reduced form (normal form)
        Object.defineProperty(this, "pivots", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // List of pivot columns (leading 1s in row-reduced form)
        this.matrix = matrix;
        this.D = this.rowReduce(matrix);
        this.pivots = this.getPivots(this.D);
    }
    // Function to row-reduce the matrix
    rowReduce(matrix) {
        const numRows = matrix.length;
        const numCols = matrix[0].length;
        const reducedMatrix = matrix.map(row => row.slice()); // Make a copy of the matrix
        let lead = 0;
        for (let r = 0; r < numRows; r++) {
            if (lead >= numCols) {
                return reducedMatrix;
            }
            let i = r;
            while (reducedMatrix[i][lead] === 0) {
                i++;
                if (i === numRows) {
                    i = r;
                    lead++;
                    if (lead === numCols) {
                        return reducedMatrix;
                    }
                }
            }
            // Swap rows r and i to make the leading coefficient non-zero
            [reducedMatrix[r], reducedMatrix[i]] = [reducedMatrix[i], reducedMatrix[r]];
            // Normalize the row by dividing by the leading coefficient
            const leadValue = reducedMatrix[r][lead];
            if (leadValue !== 0) {
                for (let j = 0; j < numCols; j++) {
                    reducedMatrix[r][j] /= leadValue;
                }
            }
            // Make all other rows in the current column zero
            for (let i = 0; i < numRows; i++) {
                if (i !== r) {
                    const factor = reducedMatrix[i][lead];
                    for (let j = 0; j < numCols; j++) {
                        reducedMatrix[i][j] -= factor * reducedMatrix[r][j];
                    }
                }
            }
            lead++;
        }
        return reducedMatrix;
    }
    // Find pivot columns from the row-reduced form
    getPivots(matrix) {
        const numCols = matrix[0].length;
        const pivots = [];
        const independentColumns = new Set();
        for (let i = 0; i < matrix.length; i++) {
            let pivotFound = false;
            for (let j = 0; j < numCols; j++) {
                if (matrix[i][j] !== 0) {
                    // Check if this column is linearly dependent on previous pivots
                    if (!independentColumns.has(j)) {
                        pivots.push(j);
                        independentColumns.add(j);
                        pivotFound = true;
                        break;
                    }
                }
            }
            if (!pivotFound)
                break;
        }
        return pivots;
    }
    // Compute the image basis (non-zero rows in row-reduced form)
    imageBasis() {
        return this.D.filter(row => row.some(x => x !== 0));
    }
    // Compute the kernel basis (solution to A * x = 0)
    kernelBasis() {
        const numCols = this.matrix[0].length;
        const basis = [];
        // Loop over free variables (non-pivot columns)
        for (let col = 0; col < numCols; col++) {
            if (!this.pivots.includes(col)) {
                const basisVector = Array(numCols).fill(0);
                basisVector[col] = 1;
                // Fill in the dependent variables (back-substitution)
                for (let i = 0; i < this.D.length; i++) {
                    const pivot = this.pivots[i];
                    if (pivot !== undefined) {
                        basisVector[pivot] = -this.D[i][col];
                    }
                }
                basis.push(basisVector);
            }
        }
        return basis;
    }
}
