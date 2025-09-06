import React, { useState } from "react";
import styles from "./Keybinds.module.css";
import UIButton from "../../icon/UIButton";
import { KeyboardAlt, KeyboardAltOutlined, KeyboardAltRounded, KeyboardAltSharp, KeyboardAltTwoTone, KeyboardRounded, KeyboardSharp } from "@mui/icons-material";


export const KeybindsModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UIButton selected={false} name="" onClick={() => setOpen(true)}>
        <KeyboardSharp />
      </UIButton>
      {open && (
        <div className={styles.modalBackground} onClick={() => setOpen(false)}>
          <div className={styles.modalWindow} onClick={e => e.stopPropagation()} style={{ position: "relative" }}>
            <span className={styles.close} onClick={() => setOpen(false)}>×</span>
            <div className={styles.header}>
              <div className={styles.headerLeft}></div>
              <div className={styles.headerCenter}>Keybindings</div>
              <div className={styles.headerRight} onClick={() => setOpen(false)}>
                <span className={styles.closeButton}></span>
              </div>
            </div>
            <div className={styles.body}>
              <div className={styles.column}>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>a</div> add cell</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>s</div> select</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>r</div> reset</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>d</div> delete</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>f</div> fill</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>i</div> identify</div>
              </div>
              <div className={styles.column}>
                <div className={styles.keybindItem}><div className={styles.twoKeys}><div className={styles.keyLabel}>ctrl</div><div className={styles.keyLabel}>z</div></div> undo</div>
                <div className={styles.keybindItem}><div className={styles.twoKeys}><div className={styles.keyLabel}>ctrl</div><div className={styles.keyLabel}>a</div></div> select all</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>c</div> deselect all</div>
                <div className={styles.keybindItem}><div className={styles.twoKeys}><div className={styles.keyLabel}>ctrl</div><div className={styles.keyLabel}>g</div></div> swap grid</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>[</div> lower grid</div>
                <div className={styles.keybindItem}><div className={styles.keyLabel}>]</div> raise grid</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
