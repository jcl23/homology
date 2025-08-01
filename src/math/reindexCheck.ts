import { CWComplex } from "./CWComplex";

export const reindexCheck  = function(complex: CWComplex): boolean {
    const numDimensions = 4;
    for (let d = 0; d < numDimensions; d++) {
        const cells = complex.cells[d];
        const cellIds = new Set(cells.map(cell => cell.id));
        
        // Check if we have the right number of unique IDs
        if (cellIds.size !== cells.length) {
            return false;
        }
        
        // Check if all IDs are in the range [0, cells.length-1]
        for (let i = 0; i < cells.length; i++) {
            if (!cellIds.has(i)) {
                return false;
            }
        }
    }
    return true;
}