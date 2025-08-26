import { useState } from "react";
import { AbstractCell } from "../../../math/classes/cells";
import styles from './SimplicesPanel.module.css';
import Latex from "react-latex-next";
import { texToUnicode } from "../Label";
import { getBoundaryOfCell, printChain } from "../../../math/CWComplex";

type SimplexDataProps = {
    selected?: boolean;
    cell: AbstractCell;
    toggleCellSelection: (cell: AbstractCell) => void;
}

const SimplexData = ({ selected, cell, toggleCellSelection }: SimplexDataProps) => {
    const [expanded, setExpanded] = useState(false);
    

    const boundaryList  = cell.attachingMap.map(c => c.name);
    const starList = cell.cob.map(c => c.name);
    const numLines = [
        boundaryList.length,
        starList.length,
        cell.vertices.length
    ].filter(Boolean).length;
    const expandedHeight = `${numLines * 24}px`;
    const height = expanded ? expandedHeight : "0px";
    const [showModal, setShowModal] = useState(false);
    const updateCell = (updatedCell: AbstractCell) => {
        console.log("Updating cell:", updatedCell);
    }
    return (
        <div className={styles.datumOuter}>
            <SimplexSettingsModal updateCell={updateCell} cell={cell} showModal={showModal} setShowModal={setShowModal} />
            <div className={`${styles.cellHeader} ${styles[selected ? "selected" : "unselected"]}`} onClick={() => toggleCellSelection(cell)}>
                {texToUnicode(cell.name)}
                <div style={{display: "flex", alignItems: "center"}}>
                    <div>
                    [{cell.index}] ({cell.key})
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
                    <button 
                        className={styles.cellSettingsButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            showModal ? setShowModal(false) : setShowModal(true);
                        }
                    }>...</button>
                </div>
            </div>

            <div 
                className={`${styles.cellData} ${expanded ? styles.expandedData : ""}`} 
                style={{maxHeight: height}}
                onClick={() => toggleCellSelection(cell)}
            >
                <div style={{paddingLeft: "20px"}}> 
                    del = {printChain(getBoundaryOfCell(cell))}<br />
                   bd = {cell.attachingMap.map(c => c.name).join(", ")}<br />
                   star = {cell.cob.map(c => c.name).join(", ")}<br />
                   V = {cell.vertices.map(v => v.name).join(", ")}
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


const SimplexSettingsModal = ({ cell, updateCell, showModal, setShowModal }: { cell: AbstractCell, updateCell: (cell: AbstractCell) => void, showModal: boolean, setShowModal: (show: boolean) => void }) => {
    if (!showModal) return null;
    const [name, setName] = useState(cell.name);

    return (
        <div 
            className={styles.modal} 
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            tabIndex={-2} // Makes the div focusable
        >
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Settings for {cell.name}</h3>
                    <button onClick={() => setShowModal(false)}>Close</button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.formGroup}>
                        <label htmlFor="cellName">Cell Name:</label>
                        <input
                            type="text"
                            id="cellName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    
                    <div className={styles.formActions}>
                        <button 
                            className={styles.saveButton}
                            onClick={() => {
                                cell.name = name;
                                updateCell(cell);
                                setShowModal(false);
                            }}
                        >
                            Save Changes
                        </button>
                        <button 
                            className={styles.cancelButton}
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SimplexData;