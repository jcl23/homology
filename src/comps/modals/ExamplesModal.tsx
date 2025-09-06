import React, { useState } from "react";
import styles from "./SettingsModals.module.css";
import { examples } from "../../data/examples";
import { CWComplexStateEditor } from "../../hooks/useCWComplexEditor";
import { Preset } from "../../data/presets";
import Latex from "react-latex-next";
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
        style={{ margin: "0px"}}
      >
        Show Examples
      </button>
      {open && (
        <div className={styles.background} onClick={() => setOpen(false)}>          
            <div className={styles.modalWindow} style={{
                
            }}
            // className="react-joyride__tooltip"
            
            >
            <div className={styles.header}>
          <div className={styles.headerLeft}></div>
          <div className={styles.headerCenter}>Examples</div>
          <div
            className={styles.headerRight}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <span className={styles.closeButton}>×</span>
          </div>
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
                                <h3><Latex>{example.name}</Latex></h3>
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
                                <h3><Latex>{example.name}</Latex></h3>
                                <div className={styles.exampleDescription}>{example.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
     
            {/* Content will go here */}
            
            </div>
        </div>
      )}
    </>
  );
};