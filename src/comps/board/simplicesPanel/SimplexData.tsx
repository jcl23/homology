import { useState } from "react";
import { AbstractCell } from "../../../math/classes/cells";
import styles from './SimplicesPanel.module.css';

type SimplexDataProps = {
    selected?: boolean;
    cell: AbstractCell;
    toggleCellSelection: (cell: AbstractCell) => void;
}

const SimplexData = ({ selected, cell, toggleCellSelection }: SimplexDataProps) => {
    const [expanded, setExpanded] = useState(false);
    
    const numLines = 1;

    const expandedHeight = `${numLines * 20}px`;
    const height = expanded ? expandedHeight : "0px";
    return (
        <div className={styles.datumOuter}>
            <div className={`${styles.cellHeader} ${styles[selected ? "selected" : "unselected"]}`} onClick={() => toggleCellSelection(cell)}>
                <div>{cell.name}</div>
                <div style={{display: "flex", alignItems: "center"}}>
                    <div>
                    {/* id={cell.id} */}
                    </div>
                    <button 
                        className={styles.expandButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(current => !current)
                        }}
                    >
                        {expanded ? "-" : "+"}
                    </button>
                </div>
            </div>

            <div 
                className={`${styles.cellData} ${expanded ? styles.expandedData : ""}`} 
                style={{maxHeight: height}}
                onClick={() => toggleCellSelection(cell)}
            >
                <div>
                    {cell.attachingMap.map(c => c.name).join(", ")}
                </div>
                <div>
                    {cell.cob.map(c => c.name).join(", ")}
                </div>
            </div>

        </ div>
    )
    
    
    return (
        <>
        <tr className={`simplexData ${selected ? "selected" : ""}`} onClick={() => toggleCellSelection(cell)}>
            <td>{cell.name}</td>
            <td>{cell.index}</td>
            <td>{cell.dimension}</td>
            <td><button onClick={() => setExpanded(false)}>-</button></td>
        </tr>
        <tr className={`simplexData ${selected ? "selected" : ""}`} onClick={() => toggleCellSelection(cell)}>
            <td>{cell.cob.map(c => c.name).join(", ")}</td>
        </tr>
        </>
    );
}

export default SimplexData;