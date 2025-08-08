import { useEffect, useState } from "react";
import { AbstractCell } from "../../../math/classes/cells";
import { CWComplex, getBoundary, printChain } from "../../../math/CWComplex";
import SimplexData from "./SimplexData";
import styles from './SimplicesPanel.module.css';
import { CWComplexStateEditor } from "../../../hooks/useCWComplexEditor";
type SimplicesPanelProps = {
    // complex: CWComplex;
    complexEditor: CWComplexStateEditor;
    selectionKey: "index" | "id";
    //selectedCells: Set<number>[];
    // selectedKeys: Set<string>;
    //selectCell: (dim: number, index: number) => void;
    // selectRep: (key: string) => void
    //unselectCell: (dim: number, index: number) => void;
    //unselectCell: (dim: number, index: number) => void;
    // unselectRep: (key: string) => void
}

// A list of cells that can be selected. The currently selected cells are highlighted. It's
// a list with small labels... like "Cells" then rows of cells, then "Edges" then rows of edges, etc.



const SimplicesPanel = ({ 
     complexEditor, selectionKey
    }: SimplicesPanelProps) => {
        // debugger;
    //const { complex, selectedKeys, selectRep, unselectRep } = complexEditor;
    const [vertices, edges, faces, balls] = complexEditor.cells;
    // const cells = [...complex.cells[0], ...complex.cells[1], ...complex.cells[2], ...complex.cells[3]];
    // const [vertices, edges, faces, balls] = [0, 1, 2, 3].map(dim => {
    //     const allCells = complex.cells[dim];
    //     // return unique by index
    //     return allCells.filter((cell, i, arr) => arr.findIndex(c => c.index === cell.index) === i);
    // });
    // no buttons, just click the rows
    useEffect(() => {
        console.log("again")
    }, [complexEditor.selected, complexEditor.currentComplex]);
    const toggleCellSelection = (cell: AbstractCell) => {
        console.log("Currently selected cells: ", complexEditor);
        const cellIsSelected = complexEditor.selected.has(cell);

        // remember that you cant test for having directly, so test for presence in a better way
        // don't use .has because it compared by identity not contents
        if (cellIsSelected) {
            console.notify("Unselecting")
            complexEditor.deselectRep(cell);
            // unselectRep(cell.key);
        } else {
            complexEditor.selectRep(cell.key);
        }
    }
   
    const totalNumCells = vertices.length + edges.length + faces.length + balls.length;
    const MAX_CELLS_BEFORE_SPLIT = 18;
    const [selectedDim, setSelectedDim] = useState<number>(0);
    const maxDimensionUsed = vertices.length === 0 ? -1
        : edges.length === 0 ? 0
        : faces.length === 0 ? 1
        : balls.length === 0 ? 2
        : 3;
    const doSplit = totalNumCells > MAX_CELLS_BEFORE_SPLIT;
    return (
        <div className={styles.panel}>
            <div className={styles.table}>

                    {doSplit ? <>
                        <div className={styles.dimButtons}>
                        {Array(maxDimensionUsed + 1).fill(0).map((_, i) => (
                            <div key={"dimbutton" + i} className={styles.dimButton} onClick={() => setSelectedDim(i)} style={{backgroundColor: selectedDim === i ? "var(--selected-bg)" : "var(--unselected-bg)", color: selectedDim === i ? "var(--selected-fg)" : "var(--unselected-fg)"}}>
                                {i === 0 ? "V" : i === 1 ? "E" : i === 2 ? "F" : "T"}
                            </div>
                        ))}
                        </div>
                        {[vertices, edges, faces, balls][selectedDim].map((cell, i) => (
                            <SimplexData key={cell.id + cell.positionKey} cell={cell} selected={complexEditor.selected.has(cell)} toggleCellSelection={toggleCellSelection} />
                        ))}
                    </> 
                    : Object.entries({vertices: vertices, edges: edges, faces: faces, balls: balls}).flatMap(([name, cells], i) => (
                        [

                            <div key={name}>
                                <div className={styles.dimName} style={{textAlign: "center", fontWeight: "bold"}}>{name}</div>
                            </div>,
                            (cells.map((cell, j) => (
                                <SimplexData key={cell.id} cell={cell} selected={complexEditor.selected.has(cell)} toggleCellSelection={toggleCellSelection} />
                            )))
                        ]
                    ))}

            </div>
            {/* <table cellSpacing={0} cellPadding={2} className={styles.table}>
                <thead>
                    <tr>
                        <th>AbstractCell</th>
                        <th>Boundary</th>
                        <th>Coboundary</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries({Vertices: vertices, Edges: edges, Faces: faces, Balls: balls}).flatMap(([name, cells], i) => (
                        [

                            (<tr key={name}>
                                <td colSpan={2} className={styles.dimName} style={{textAlign: "center"}}>{name}</td>
                            </tr>),
                            (cells.map((cell, j) => (
                                <SimplexData key={cell.id} cell={cell} selected={selectedKeys.has(cell.key)} toggleCellSelection={toggleCellSelection} />
                            )))
                        ]
                    ))}

                </tbody>
            </table> */}
            {/* <div className={styles.verticesPanel}>
                <h2>Vertices</h2>
                {vertices.map((vertex) => (
                    <div className={selectedReps.has(vertex) ? styles.selected : ""} key={vertex.id} onClick={(e) => {toggleCellSelection(vertex)}}>{vertex.name}</div>
                ))}
            </div>
            <div className={styles.edgesPanel}>
                <h2>Edges</h2>
                {edges.map((edge) => (
                    <div className={selectedReps.has(edge) ? styles.selected : ""} key={edge.id} onClick={(e) => {toggleCellSelection(edge)}}>{describeCell(edge)}</div>
                ))}
            </div>
            <div className={styles.facesPanel}>
                <h2>Faces</h2>
                {faces.map((face) => (
                    <div className={selectedReps.has(face) ? styles.selected : ""} key={face.id} onClick={(e) => {toggleCellSelection(face)}}>{describeCell(face)}</div>
                ))}
            </div>
            <div className={styles.ballsPanel}>
                <h2>Balls</h2>
                {balls.map((ball) => (
                    <div className={selectedReps.has(ball) ? styles.selected : ""} key={ball.id} onClick={(e) => {toggleCellSelection(ball)}}>{describeCell(ball)}</div>
                ))}
            </div> */}
        </div>
    )
}

export default SimplicesPanel;

/* const describeBoundary = (cell: AbstractCell) => {
        if (cell.dimension === 0) {
            return "0";
        }
        if (cell.dimension > 0) {
            const boundary = getBoundary(complex, [{dimension: cell.dimension, index: cell.index, sign: 1}]);
            return printChain(complex, boundary);
        }
        return "";
    }

    const describeCoboundary = (cell: AbstractCell) => {
        return cell.cob.map(c => c.name).join(", ");
    }
    const describeCell = (cell: AbstractCell) => {
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
            const boundary = getBoundary(complex, [{dimension: cell.dimension, index: cell.index, sign: 1}]);
            const boundaryExpression = printChain(complex, boundary);
            const boundarySquared = getBoundary(complex, boundary);
            const boundarySquaredExpression = printChain(complex, boundarySquared);
            return `∂${cell.name} =  ${boundaryExpression}, ∂∂${cell.name} = ${boundarySquaredExpression}`; ;
        }
        return `${cell.id} = `;
    }*/