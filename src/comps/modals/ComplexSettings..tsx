import react, { useMemo, useRef, useState } from "react";
import styles from "./SettingsModals.module.css"

import { defaultComplex, complexes, Preset } from "../../data/presets";

import { ComplexMeta, CWComplex } from "../../math/CWComplex";
import { CWComplexStateEditor, makeDefaultMeta } from "../../hooks/useCWComplexEditor";
import { FileOpen, FolderOpen, Settings } from "@mui/icons-material";

type ComplexSettingsProps = {
    complexEditor: CWComplexStateEditor;
    setAllowEditing: (allow: boolean) => void;
}

export const ComplexSettings = function({ 
    complexEditor, setAllowEditing
}: ComplexSettingsProps) {

    // list available complexes
    
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        if (showModal) return; // Prevent reopening if already open
        setTimeout(() => {
            divRef.current?.focus();
            const randomBorderWidth = Math.floor(Math.random() * 5) + 1; // Random border width between 1 and 5
            if (divRef?.current?.style?.borderWidth) divRef.current.style.borderWidth = `${randomBorderWidth}px`;
        },1000);
        setShowModal(true);
        setAllowEditing(false);
    }
    const closeModal = () => {
        setShowModal(false);
        setAllowEditing(true);
    }
    
    const [meta, setMeta] = useState(complexEditor.meta);
    const setName = (name: string) => {
        setMeta((meta: ComplexMeta) => {
            return { ...meta, name };
        });
    }
    const save = () => {
        complexEditor.setMeta({ ...complexEditor.meta, name: meta.name });
    }
    const settingsList = useMemo(() => {
        return Object.entries(makeDefaultMeta());
    }, [makeDefaultMeta]);

    const divRef = useRef<HTMLDivElement>(null);
    const wholeModal = (
        <div className={styles.background}
            onClick={(e) => e.stopPropagation()}

            onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'Enter') {
                    save();
                    closeModal();
                }
            }}

        >
            <div className={styles.modalWindow}             id="settingsModal"

            >
                <div className={styles.modalHeader}>
                    <h2>
                       Complex Settings
                    </h2>
                     <button type={"button"} className={`joyride__tooltip__edge ${styles.close}`} tabIndex={10} aria-label="Close" data-action="close" onClick={() => { closeModal(); console.warn("test"); } } >
                        &times;
                    </button>
                    {/* <button className="react-joyride__tooltip__edge button" style={{minWidth: "20px", paddingLeft: "60px!important"}}  > */}
              {/* &times;
            </button> */}
                </div>
                <div className={styles.list}
                    ref={divRef}
                    tabIndex={-1}
                >
                    <table>   
                {
                    settingsList.map(([key, value], ind) => (
                        <tr key={key}>
                            {/* <label> */}
                                <td>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                </td>
                                <td>

                                <input 
                                    tabIndex={ind + 1}
                                    type="text" 
                                    defaultValue={meta[key as keyof ComplexMeta] || ""} 
                                    onChange={(e) => {
                                        setMeta((meta: ComplexMeta) => {
                                            return { ...meta, [key]: e.target.value };
                                        });
                                        complexEditor.setMeta({ ...complexEditor.meta, [key]: e.target.value });
                                        divRef.current?.focus();
                                    }} 
                                    />
                                </td>
                            {/* </label> */}
                        </tr>
                    ))
                }
                  </table>
                    <div>
                        <button onClick={() => { save(); closeModal(); }}>
                            Save Complex
                        </button>
                    </div>
                    <div>
                        <button onClick={() => { complexEditor?.reset(); }}>
                            Reset Complex
                        </button>
                    </div>
                    Debug: { JSON.stringify(meta)} 
                </div>
            </div>
        </div>
    )

    return (
        <>
        <button
            className={styles.button} 
            onClick={openModal}
        >
            <div>
                <div style={{marginLeft: "3px"}}>
                    <Settings />
                </div>
                cfg
            </div>
        </button>
        { showModal && wholeModal }
        </>
    );
    
}