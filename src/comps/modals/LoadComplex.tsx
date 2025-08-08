import react, { useState } from "react";
import styles from "./SettingsModals.module.css"

import { defaultComplex, complexes, Preset } from "../../data/presets";

import { CWComplex } from "../../math/CWComplex";
import { CWComplexStateEditor } from "../../hooks/useCWComplexEditor";
import { FileOpen, FolderOpen } from "@mui/icons-material";

type LoadComplexProps = {
    setPreset: (p: Preset) => void;
    // defaultComplexes: {
    //     name: CWComplex;
    //     complex: CWComplex;
    // }[];
}

export const LoadComplex = function({ 
    setPreset, 
    // defaultComplexes 
}: LoadComplexProps) {
    
    // list available complexes
    
    const [showModal, setShowModal] = useState(false);

    const wholeModal = (
        <div className={styles.background}>
            <div className={styles.modalWindow}>
                <div className={styles.modalHeader}>
                    <h2>
                        Load Complex
                    </h2>
                    <button className={styles.closeModal} onClick={() => { setShowModal(false); console.warn("test"); }}>
                        Close
                    </button>
                </div>
                <ul className={styles.list}>
                    {
                        Object.values(complexes).map((preset) => (
                            <li onClick={() => { setPreset(() => preset); }}>
                                {preset.name}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )

    return (
        <>
        <button
            className={styles.button} 
            onClick={() => { setShowModal(true); }}
        >
            <div>
                <div style={{marginLeft: "3px"}}>
                    <FolderOpen />
                </div>
                load
            </div>
        </button>
        { showModal && wholeModal }
        </>
    );
    
}