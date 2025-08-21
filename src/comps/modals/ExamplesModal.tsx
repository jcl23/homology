import React, { useState } from "react";
import styles from "./SettingsModals.module.css";
import { examples } from "../../data/examples";
import { CWComplexStateEditor } from "../../hooks/useCWComplexEditor";
import { Preset } from "../../data/presets";
type ExamplesModalProps = {
//   editor: CWComplexStateEditor;
    setPreset: (preset: Preset) => void; // Adjust type as needed
};


export const ExamplesModal: React.FC<ExamplesModalProps> = ({ setPreset }) => {
  const [open, setOpen] = useState(false);
    const evens = examples.filter((_, index) => index % 2 === 0);
    const odds = examples.filter((_, index) => index % 2 !== 0);
  return (
    <>
      <button
        className={styles.beacon}
        onClick={() => setOpen(true)}
        style={{ margin: "8px" }}
      >
        Show Examples
      </button>
      {open && (
        <div className={styles.background} onClick={() => setOpen(false)}>          
            <div className={styles.modalWindow} style={{
                
            }}
            // className="react-joyride__tooltip"
            
            >
            <div style={{ marginBottom: "16px" }}>
                <strong>Examples Modal</strong>
            </div>
                <div className={styles.examplesBody} >
                    <div className={styles.examplesColumn}>
                        {/* Left column content */}
                        {evens.map((example, index) => (
                            <div key={index} className={styles.exampleItem} onClick={() => {
                                        setPreset(() => example.setter);
                                        setOpen(false);
                                    }}
                            >
                                <h3>{example.name}</h3>
                                <div className={styles.exampleDescription}>{example.description}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.examplesColumn}>
                        {/* Right column content */}
                        {odds.map((example, index) => (
                            <div key={index} className={styles.exampleItem} onClick={() => {
                                        setPreset(() => example.setter);
                                        setOpen(false);
                                    }}
                            >
                                <h3>{example.name}</h3>
                                <div className={styles.exampleDescription}>{example.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
     
            {/* Content will go here */}
            <button
                className="react-joyride__beacon"
                onClick={() => setOpen(false)}
                style={{ marginTop: "16px" }}
            >
                Close
            </button>
            </div>
        </div>
      )}
    </>
  );
};