import { useEffect, useState } from "react";
import { AbstractCell } from "../../../math/classes/cells";
import SimplexData from "./SimplexData";
import styles from './SimplicesPanel.module.css';
import { CWComplexStateEditor } from "../../../hooks/useCWComplexEditor";
import { useControls } from "leva";
type SimplicesPanelProps = {
    // complex: CWComplex;
    complexEditor: CWComplexStateEditor;
    selectionKey: "index" | "id";
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

    const [ { showIdentifiedCells: useID }, set ] = useControls(() => ({
        showIdentifiedCells: false
    }));
    const [vertices, edges, faces, balls] = [0, 1, 2, 3].map(dim => {
        const allCells = complexEditor.cells[dim];
        allCells.sort((a, b) => a.name.localeCompare(b.name));
        // return unique by index
        if (useID) return allCells;
        return allCells.filter((cell, i, arr) => arr.findIndex(c => c.index === cell.index) === i);
    });
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
            if (useID) {
                complexEditor.deselectRep(cell.key);
            } else {
                complexEditor.deselectIndex(cell.dimension, cell.index);
            }
            // unselectRep(cell.key);
        } else {
            console.notify("Selecting")
            if (useID) {
                complexEditor.selectRep(cell.key);
            } else {
                complexEditor.selectIndex(cell.dimension, cell.index);
            }
            // selectRep(cell.key);

        }
    }
//    const [viewMode, setViewMode] = useState<"index" | "id">("id");
    const totalNumCells = vertices.length + edges.length + faces.length + balls.length;
    const MAX_CELLS_BEFORE_SPLIT = 18;
    const [selectedDim, setSelectedDim] = useState<number>(0);
    const maxDimensionUsed = vertices.length === 0 ? -1
        : edges.length === 0 ? 0
        : faces.length === 0 ? 1
        : balls.length === 0 ? 2
        : 3;
    const doSplit = totalNumCells > MAX_CELLS_BEFORE_SPLIT;
    const sliderPinLeft = !useID ? "0" : "calc(100% - 16px)";

    return (
        <div className={styles.panel}>
            <div className={styles.header} style={{
                
                height: "30px", border: "1px solid red", padding: '5px', marginBottom: '10px',
                 display: "none", 
                //  display: "flex", 
                 }}>
                    <div>Index</div>
                    <div style={{
                        width: "50px", height: "100%",
                        border: "1px solid black", backgroundColor: useID ? "var(--selected-bg)" : "var(--unselected-bg)",
                        transition: "background-color 0.15s",
                        left: "calc(100% - 50px)",
                        
                        
                        
                    }}
                    onClick={() => { set({ showIdentifiedCells: !useID }) } }
                    >
                        <div style={{
                            height: "100%",
                            aspectRatio: "1",
                            left: sliderPinLeft,
                            position: "relative",
                            backgroundColor: useID ? "var(--selected-fg)" : "var(--unselected-fg)",
                            transition: "left 0.15s, background-color 0.15s"
                        }} />
                    </div>
                            <div>ID</div>
            </div>
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
                    : Object.entries({vertices: vertices, edges: edges, faces: faces, tetra: balls}).flatMap(([name, cells], i) => (
                        [

                            <div key={name}>
                                <div className={styles.dimName} style={{textAlign: "center", fontWeight: "bold"}}>{name} ({cells.length})</div>
                            </div>,
                            (cells.map((cell, j) => (
                                <SimplexData key={cell.id} cell={cell} selected={complexEditor.selected.has(cell)} toggleCellSelection={toggleCellSelection} />
                            )))
                        ]
                    ))}

            </div>
            {`(${doSplit ? [vertices, edges, faces, balls][selectedDim].length : totalNumCells} cells)`}
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

