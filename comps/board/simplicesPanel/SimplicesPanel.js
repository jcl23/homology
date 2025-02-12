import { jsx as _jsx } from "react/jsx-runtime";
import { getBoundary, printChain } from "../../../math/CWComplex";
import SimplexData from "./SimplexData";
import styles from './SimplicesPanel.module.css';
// A list of cells that can be selected. The currently selected cells are highlighted. It's
// a list with small labels... like "Cells" then rows of cells, then "Edges" then rows of edges, etc.
const SimplicesPanel = ({ complex, 
//selectedCells, selectCell, unselectCell,
selectedKeys, selectRep, unselectRep, selectionKey }) => {
    const cells = [...complex.cells[0], ...complex.cells[1], ...complex.cells[2], ...complex.cells[3]];
    const [vertices, edges, faces, balls] = [0, 1, 2, 3].map(dim => {
        const allCells = complex.cells[dim];
        // return unique by index
        return allCells.filter((cell, i, arr) => arr.findIndex(c => c.index === cell.index) === i);
    });
    // no buttons, just click the rows
    const toggleCellSelection = (cell) => {
        const cellIsSelected = selectedKeys.has(cell.key);
        // remember that you cant test for having directly, so test for presence in a better way
        // don't use .has because it compared by identity not contents
        if (cellIsSelected) {
            console.notify("Unselecting");
            unselectRep(cell.key);
        }
        else {
            selectRep(cell);
        }
    };
    const describeBoundary = (cell) => {
        if (cell.dimension === 0) {
            return "0";
        }
        if (cell.dimension > 0) {
            const boundary = getBoundary(complex, [{ dimension: cell.dimension, index: cell.index, sign: 1 }]);
            return printChain(complex, boundary);
        }
        return "";
    };
    const describeCoboundary = (cell) => {
        return cell.cob.map(c => c.name).join(", ");
    };
    const describeCell = (cell) => {
        if (cell.dimension === 0) {
            return `${cell.id}`;
        }
        if (cell.dimension > 0) {
            //return getVertices(cell).map(vertex => vertex.point).join(", ");
            // let edgeString = edges.reduce((acc: string, edge: AbstractEdge, i: number, arr: AbstractEdge[]) => {
            //     const leastIndex = edge.attachingMap.reduce((acc, vertex) => Math.min(acc, vertex.index), Infinity);
            //     const orientationSymbol = (leastIndex % 2) == 0 ? "+" : "-";
            //     return acc + " " + orientationSymbol + (edge?.name as any ?? "") ;
            // }, "")
            // remoive leading plus if it's there
            const boundary = getBoundary(complex, [{ dimension: cell.dimension, index: cell.index, sign: 1 }]);
            const boundaryExpression = printChain(complex, boundary);
            const boundarySquared = getBoundary(complex, boundary);
            const boundarySquaredExpression = printChain(complex, boundarySquared);
            return `∂${cell.name} =  ${boundaryExpression}, ∂∂${cell.name} = ${boundarySquaredExpression}`;
            ;
        }
        return `${cell.id} = `;
    };
    return (_jsx("div", { className: styles.panel, children: _jsx("div", { className: styles.table, children: Object.entries({ vertices: vertices, edges: edges, faces: faces, balls: balls }).flatMap(([name, cells], i) => ([
                _jsx("div", { children: _jsx("div", { className: styles.dimName, style: { textAlign: "center", fontWeight: "bold" }, children: name }) }, name),
                (cells.map((cell, j) => (_jsx(SimplexData, { cell: cell, selected: selectedKeys.has(cell.key), toggleCellSelection: toggleCellSelection }, cell.id))))
            ])) }) }));
};
export default SimplicesPanel;
