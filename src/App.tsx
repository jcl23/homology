import React, { useEffect, useState } from "react";
import "./App.css";
import "./comps/Joyride.css";
import UIPanel from "./comps/UIPanel";
import Board from "./comps/board/Board";
import SimplicesPanel from "./comps/board/simplicesPanel/SimplicesPanel";
import { defaultComplex } from "./data/presets";
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

  const [preset, setPreset] = useState(defaultComplex);
  
  const [editorState, complexEditor] = useEditComplex();
  
  useEffect(() => {
    complexEditor.reset();
    defaultPreset(complexEditor);
  }, [defaultPreset]);
  
  const { mode, selectionKey } = editOptions
  const { nameState } = viewOptions;

  const { selectedKeys, complex} = editorState;

  useKeybindings(setEditOptions, setViewOptions, complexEditor, allowEditing);

  // useEffect(() => {
  //   // If the mode is delete, delete the selected cells
  //   if (mode === "remove") {
  //     // performActionOnSelectedReps((cell) => {throw new Error("Pluh")});
  //   }
  // }, [selectedState]);
  return (
    <ThemeProvider theme={theme}>
      <TutorialProvider>

      <CssBaseline />
      <NotificationManager />
      
      <ErrorBoundary> 
        <div className="board">
          <div className="modalHolder">
          </div>
          <div className={styles.panelHolder}>
            <HelpPanel />
              <button className={styles.button} style={{height: "40px", color: "#555"}} onClick={() => setAllowEditing(!allowEditing) } >{allowEditing ? "toggle demo mode" : "View"}</button>
            <div className={styles.upperPanel} style={{ display: 'flex', flexDirection: 'row' }}>
              {/* <DebugComplex complex={complex} /> */}
              <LoadComplex setPreset={setPreset} />
              <UIPanel
                complexEditor={complexEditor}
                setEditOptions={setEditOptions}
                editOptions={editOptions}
                setViewOptions={setViewOptions}
                viewOptions={{ nameState }}
                editorState={editorState}
              />
              {/* <PresetPanel setComplex={setStartingComplex} /> */}
              <SimplicesPanel 
                selectionKey={selectionKey}
                complex={complex}
                selectedKeys={selectedKeys} 
                selectRep={complexEditor.selectRep} 
                unselectRep={complexEditor.toggleRepSelection}
              />
            </div>
              <div className={styles.lowerPanel} key={"COMPLEX"}>
                  <HomologyPanel complex={complex}  />
              </div>
        </div>
      
      <div className="centerHolder">
        <History complexEditor={complexEditor} editorState={editorState}/>
        <Board
          allowEditing={allowEditing} 
          viewOptions={viewOptions} 
          editOptions={editOptions} 
          editComplex={complexEditor}
          complex={complex}
          selectedReps={selectedKeys}
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
