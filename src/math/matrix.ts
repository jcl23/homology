export type Matrix = number[][];
export type LabeledMatrix = { 
    matrix: Matrix, 
    ins: string[],
    outs: string[]
};
// stuff to do: matrix creation, row / col swapping, multiplication, scalar multiplications (row/col wise), addition, subtraction, transposition, determinant, inverse, rank, nullity, row echelon form, reduced row echelon form, matrix multiplication, matrix exponentiation, matrix addition, matrix subtraction, matrix division, matrix inversion, matrix determinant, matrix rank, matrix nullity, matrix transpose, matrix row echelon form, matrix reduced row echelon form, matrix row / col swapping, matrix scalar multiplication, matrix row / col addition, matrix row / col subtraction, matrix row / col multiplication, matrix row / col division, matrix row / col inversion, matrix row / col determinant, matrix row / col rank, matrix row / col nullity, matrix row / col transpose, matrix row / col echelon form, matrix row / col reduced echelon form, matrix row / col swapping, matrix row / col scalar multiplication, matrix row / col addition, matrix row / col subtraction, matrix row / col multiplication, matrix row / col division, matrix row / col inversion, matrix row / col determinant, matrix row / col rank, matrix row / col nullity, matrix row / col transpose, matrix row / col echelon form, matrix row / col reduced echelon form, matrix row / col swapping, matrix row / col scalar multiplication, matrix row / col addition, matrix row / col subtraction, matrix row / col multiplication, matrix row / col division, matrix row / col inversion, matrix row / col determinant, matrix row / col rank, matrix row / col nullity, matrix row / col transpose, matrix row / col echelon form, matrix row / col reduced echelon form, matrix row / col swapping, matrix row / col scalar multiplication, matrix row / col addition, matrix row / col subtraction, matrix row / col multiplication, matrix row / col division, matrix row / col inversion, matrix row / col determinant, matrix row / col rank, matrix row / col nullity, matrix row / col transpose, matrix row / col echelon form, matrix row / col reduced echelon form, matrix row / col swapping, matrix row / col scalar multiplication, matrix row / col addition, matrix row / col subtraction, matrix row / col multiplication, matrix row / col division, matrix row / col inversion, matrix row / col determinant, matrix row / col rank, matrix row / col nullity, matrix row / col transpose, matrix row / col echelon form, matrix row / col reduced echelon form, matrix row / col swapping
export const createMatrix = (rows: number, cols: number): Matrix => {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
};

export const copyMatrix = (matrix: Matrix): Matrix => {
    return matrix.map(row => [...row]);
}

export const swapRows = (matrix: Matrix, row1: number, row2: number): Matrix => {
    const newMatrix = matrix.map(row => [...row]);
    [newMatrix[row1], newMatrix[row2]] = [newMatrix[row2], newMatrix[row1]];
    return newMatrix;
};

export const swapCols = (matrix: Matrix, col1: number, col2: number): Matrix => {
    const newMatrix = matrix.map(row => [...row]);
    for (let i = 0; i < matrix.length; i++) {
        [newMatrix[i][col1], newMatrix[i][col2]] = [newMatrix[i][col2], newMatrix[i][col1]];
    }
    return newMatrix;
};

export const multiplyMatrix = (matrix: Matrix, scalar: number): Matrix => {
    return matrix.map(row => row.map(val => val * scalar));
};

export const multiplyRow = (matrix: Matrix, row: number, scalar: number): Matrix => {
    return matrix.map((r, i) => i === row ? r.map(val => val * scalar) : r);
};

export const multiplyCol = (matrix: Matrix, col: number, scalar: number): Matrix => {
    return matrix.map((r, i) => r.map((val, j) => j === col ? val * scalar : val));
};

export const addMatrix = (matrix1: Matrix, matrix2: Matrix): Matrix => {
    return matrix1.map((row, i) => row.map((val, j) => val + matrix2[i][j]));
};

export const rowCombine = (matrix: Matrix, row1: number, row2: number, scalar: number): Matrix => {
    return matrix.map((r, i) => i === row1 ? r.map((val, j) => val + scalar * matrix[row2][j]) : r);
}

export const colCombine = (matrix: Matrix, col1: number, col2: number, scalar: number): Matrix => {
    return matrix.map((r, i) => r.map((val, j) => j === col1 ? val + scalar * matrix[i][col2] : val));
}

const transpose = (matrix: Matrix): Matrix => {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}








export const simultaneousReduce = function(A: Matrix, B: Matrix): [Matrix, Matrix] {
    if (A[0].length !== B.length ) {
        throw new Error(`Width of A must be equal to height of B: ${A[0].length} !== ${B.length}`);
    }
    const numRows = A.length;
    const numCols = B[0].length;

    let i, j;
    i = j = 0;
    while (true) {
        if (i === numRows || j === numCols) break;
        if (A[i][j] == 0) {
            let nonzeroCol = j;
            while (nonzeroCol < numCols && A[i][nonzeroCol] == 0) {
                nonzeroCol++;
            }

            if (nonzeroCol == numCols){
                i += 1;
                continue;
            }
            A = swapCols(A, j, nonzeroCol);
            B = swapRows(B, j, nonzeroCol);

            const pivot = A[i][j];
            A = multiplyCol(A, j, 1 / pivot);
            B = multiplyRow(B, j, 1 / pivot);
            for (let otherCol = 0; otherCol < numCols; otherCol++) {
                if (otherCol === j) continue;
                if (A[i][otherCol] != 0) {
                    let scaleAmt = -A[i][otherCol];
                    A = colCombine(A, otherCol, j, scaleAmt);
                    B = rowCombine(B, j, otherCol, -scaleAmt);
                }
            }

            i++; j++;
        }
        return [A, B];
        
    }
    return [A, B];
}


function gcd(a: number, b: number): number {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function lcm(a: number, b: number): number {
    return Math.abs(a * b) / gcd(a, b);
}

function matrixAddRow(A: Matrix, row1: number, row2: number, factor: number): Matrix {
    const newMatrix = A.map(row => [...row]);
    for (let j = 0; j < newMatrix[row1].length; j++) {
        newMatrix[row1][j] += factor * newMatrix[row2][j];
    }
    return newMatrix;
}

function matrixSwapRows(A: Matrix, row1: number, row2: number): Matrix {
    const newMatrix = A.map(row => [...row]);
    const temp = newMatrix[row1];
    newMatrix[row1] = newMatrix[row2];
    newMatrix[row2] = temp;
    return newMatrix;
}

function matrixSwapCols(A: Matrix, col1: number, col2: number): Matrix {
    const newMatrix = A.map(row => [...row]);
    for (let i = 0; i < newMatrix.length; i++) {
        const temp = newMatrix[i][col1];
        newMatrix[i][col1] = newMatrix[i][col2];
        newMatrix[i][col2] = temp;
    }
    return newMatrix;
}
function columnEmpty(A: Matrix, col: number): boolean {
    return A.every(row => row[col] === 0);
}

export function isZeroMatrix(A: Matrix): boolean {
    return A.every(row => row.every(value => value === 0));
}
export function rankImage(A: Matrix): number {
    let rank = 0;

    for (let row = 0; row < A.length; row++) {
        for (let col = 0; col < A[row].length; col++) {
            if (A[row][col] !== 0) {
                rank++;
                break; // Move to the next row after finding the pivot
            }
        }
    }

    return rank;
}
export function rankKernel(A: Matrix): number {

    const width = A[0].length;
    let rank = 0;
    for (let j = 0; j < width; j++) {
        if (columnEmpty(A, j)) {
            rank++;
        }
    }
    return rank;
}
export function computeTorsion(A: Matrix): number[] {
    const maxRank = Math.min(A.length, A[0].length);
    const torsionElements = [];
    for (let i = 0; i < maxRank; i++) {
        if (A[i][i] > 1) {
            torsionElements.push(A[i][i]);
        }
    }
    return torsionElements;
}
// export function smithNormalForm(A: Matrix): Matrix {
//     const rows = A.length;
//     const cols = A[0].length;

//     let r = 0;
//     let c = 0;
//     let matrix = A;

//     while (r < rows && c < cols) {
//         // Find the pivot in the current column
//         let pivotRow = r;
//         for (let i = r + 1; i < rows; i++) {
//             if (matrix[i][c] !== 0 && Math.abs(matrix[i][c]) < Math.abs(matrix[pivotRow][c])) {
//                 pivotRow = i;
//             }
//         }

//         if (matrix[pivotRow][c] === 0) {
//             // No pivot found in this column, move to next column
//             c++;
//             continue;
//         }

//         // Swap the pivot row with the current row
//         if (pivotRow !== r) {
//             matrix = matrixSwapRows(matrix, r, pivotRow);
//         }

//         // Make the pivot element 1
//         const pivot = matrix[r][c];
//         matrix = matrix.map(row => row.map((value, index) => index === c ? value / pivot : value));

//         // Eliminate all other entries in the current column
//         for (let i = 0; i < rows; i++) {
//             if (i !== r && matrix[i][c] !== 0) {
//                 const factor = Math.floor(matrix[i][c]);
//                 matrix = matrixAddRow(matrix, i, r, -factor);
//             }
//         }

//         // Eliminate all other entries in the current row
//         for (let j = 0; j < cols; j++) {
//             if (j !== c && matrix[r][j] !== 0) {
//                 const factor = Math.floor(matrix[r][j]);
//                 matrix = matrixAddRow(matrix, r, c, -factor);
//             }
//         }

//         // Move to the next row and column
//         r++;
//         c++;
//     }

//     return matrix;
// }
export const reduce = function(B: Matrix) {
    const numRows = B.length;
    const numCols = B[0].length;

    let i, j;
    i = j = 0;

    while (true) {
        if (i >= numRows || j >= numCols) break;

        if (B[i][j] == 0) {
            let nonzeroRow = i;
            while (nonzeroRow < numRows && B[nonzeroRow][j] == 0) {
                nonzeroRow++;
            }

            if (nonzeroRow == numRows) {
                j++; continue;
            }

            B = swapRows(B, i, nonzeroRow);
        }

        const pivot = B[i][j];
        B = multiplyRow(B, i, 1 / pivot);


        for (let otherRow = 0; otherRow < numRows; otherRow++) {
            if (otherRow == i) continue;
            if (B[otherRow][i] != 0) {
                let scaleAmt = -B[otherRow][j];
                B = rowCombine(B, otherRow, i, scaleAmt);
            }
        }

        i++; j++;
    }
    return B;
}

export function numPivotCols(A: Matrix): number {
    const z = Array(A.length).fill(0);
    return A[0].map((_, j) => A.every(row => row[j] === 0)).filter(isZeroCol => !isZeroCol).length;
}

export function numPivotRows(A: Matrix): number {
    const z = Array(A[0].length).fill(0);
    return A.map(row => row.every(value => value === 0)).filter(isZeroRow => !isZeroRow).length;
}