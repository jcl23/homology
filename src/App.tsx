import React, { useEffect, useState } from "react";
import "./App.css";
import "./comps/Joyride.css";
import UIPanel from "./comps/UIPanel";
import Board from "./comps/board/Board";
import SimplicesPanel from "./comps/board/simplicesPanel/SimplicesPanel";
import { defaultComplex, Preset } from "./data/presets";
import { HomologyPanel } from "./comps/HomologyPanel";
import { LoadComplex } from "./comps/modals/LoadComplex";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./style/theme";
import { useEditComplex } from "./hooks/useCWComplexEditor";
import { ErrorBoundary } from "./comps/ErrorBoundary";
import NotificationManager from "./comps/notifs/NotificationManager";
import History from "./comps/history/History.tsx";
import styles from "./App.module.css";
import { defaultPreset } from "./data/defaultComplexes";
import { HelpPanel } from "./comps/help/HelpPanel";
import { useKeybindings } from "./keybinding.ts";
import { TutorialProvider } from "./tutorial/TutorialContext.tsx";
import { ComplexSettings } from "./comps/modals/ComplexSettings..tsx";

const MAX_DIM = 3;

export type EditOptions = {
  mode: "select" | "move" | "add" | "remove";
  selectionKey: "index" | "id";
  gridHeight: number;
  isMouseDown: boolean;
  dimSelected: number;
} 
export type SetEditOptions = React.Dispatch<React.SetStateAction<EditOptions>>;
export type ViewOptions = {
  nameState: boolean[];
}
export type SetViewOptions = React.Dispatch<React.SetStateAction<ViewOptions>>;



function App() {
  
  const [allowEditing, setAllowEditing] = useState(true);
  const [ editOptions, setEditOptions] = useState<EditOptions>({
    mode: "select",
    selectionKey: "index",
    gridHeight: 0,
    isMouseDown: false,
    dimSelected: -1
  });
  const [ viewOptions, setViewOptions] = useState<ViewOptions>({
    nameState: [true, true, true, true],
  });

  const [preset, setPreset] = useState<Preset>(() => defaultComplex);
  
  const complexEditor = useEditComplex();
  
  useEffect(() => {
    complexEditor.reset();
    preset(complexEditor);
  }, [preset]);
  
  const { mode, selectionKey } = editOptions
  const { nameState } = viewOptions;

  const selectedKeys = complexEditor.selected;
  // const { selectedKeys, complex} = complexEditor.editorState;

  useKeybindings(setEditOptions, setViewOptions, complexEditor, allowEditing);

  // useEffect(() => {
  //   // If the mode is delete, delete the selected cells
  //   if (mode === "remove") {
  //     // performActionOnSelectedReps((cell) => {throw new Error("Pluh")});
  //   }
  // }, [selectedState]);
  return (
    <ThemeProvider theme={theme}>
      <TutorialProvider
      // complexEditor={complexEditor}
        // editorState={complexEditor}
        editOptions={editOptions}
        viewOptions={viewOptions}
        complexEditor={complexEditor}
      >

      <CssBaseline />
      <NotificationManager />
      
      <ErrorBoundary> 
        <div className="board">
          <div className="modalHolder">
          </div>
          <div className={styles.panelHolder}>
            <HelpPanel />
             <div style={{minHeight: "50px"}}></div>
            <div className={styles.upperPanel} style={{ display: 'flex', flexDirection: 'row' }}>
              {/* <DebugComplex complex={complex} /> */}
              <div className={styles.filePanel}>
                <LoadComplex setPreset={setPreset} />
                <ComplexSettings complexEditor={complexEditor} setAllowEditing={setAllowEditing} />

              </div>
              <UIPanel
                complexEditor={complexEditor}
                setEditOptions={setEditOptions}
                editOptions={editOptions}
                setViewOptions={setViewOptions}
                viewOptions={{ nameState }}
              />
              {/* <PresetPanel setComplex={setStartingComplex} /> */}
              <SimplicesPanel 
                selectionKey={selectionKey}
                complexEditor={complexEditor}
                // selectedKeys={selectedKeys} 
                // selectRep={complexEditor.selectRep} 
                // unselectRep={complexEditor.toggleRepSelection}
              />
            </div>
              <div className={`${styles.lowerPanel} lowerPanel`} key={"COMPLEX"}>
                  <HomologyPanel complex={complexEditor.currentComplex}  />
              </div>
        </div>
      
      <div className="centerHolder">
        <History complexEditor={complexEditor} editorState={complexEditor.editorState} />
        <Board
          allowEditing={allowEditing} 
          viewOptions={viewOptions} 
          editOptions={editOptions} 
          editComplex={complexEditor}
          complex={complexEditor.currentComplex}
          // selectedReps={complexEditor.selected}
        />
        <div className={styles.keybinds}>
      <div className={styles.keybindLabel}> a: add cell </div>
      <div className={styles.keybindLabel}> s: select </div>
      <div className={styles.keybindLabel}> m: move </div>
      <div className={styles.keybindLabel}> t: trash </div>
      <div className={styles.keybindLabel}> d: delete </div>
      <div className={styles.keybindLabel}> f: fill </div>
    </div>
        <div className={styles.keybinds}>
      <div className={styles.keybindLabel}> i: identify </div>
      <div className={styles.keybindLabel}> ctrl-z: undo </div>
      <div className={styles.keybindLabel}> ctrl-a: select all </div>
      <div className={styles.keybindLabel}> ctrl-d: deselect all </div>
      <div className={styles.keybindLabel}> c: select none</div>
    </div>
      </div>
    </div>
    </ErrorBoundary>
      </TutorialProvider>
      </ThemeProvider>
  );
}

export default App;
