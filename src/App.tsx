import React, { useEffect, useState } from "react";
import "./App.css";
import "./comps/Joyride.css";
import UIPanel from "./comps/UIPanel";
import Board from "./comps/board/Board";
import SimplicesPanel from "./comps/board/simplicesPanel/SimplicesPanel";
import { complexes, defaultComplex, Preset } from "./data/presets";
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
import { HelpPanel } from "./comps/help/HelpPanel";
import { useKeybindings } from "./keybinding.ts";
import { TutorialProvider } from "./tutorial/TutorialContext.tsx";
import { ComplexSettings } from "./comps/modals/ComplexSettings..tsx";
import { useThree } from "@react-three/fiber";
import { Download, FolderOpen } from "@mui/icons-material";
import { downloadHistory } from "./data/download.ts";
import { useControls } from "leva";
import UIButton from "./icon/UIButton.tsx";

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
  gridStyle: "triangular" | "square";
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
    nameState: [true, true, true, true], gridStyle:  "square"
  });

  const [preset, setPreset] = useState<Preset>(() => defaultComplex);
  
  const [editorState, complexEditor] = useEditComplex();
  
  useEffect(() => {
    complexEditor.reset();
    preset(complexEditor);
    // complexEditor.deselectAll();
  }, [preset]);

  
  const { mode, selectionKey } = editOptions
  const { nameState, gridStyle } = viewOptions;

  useKeybindings(setEditOptions, setViewOptions, complexEditor, allowEditing);
  const { vertexNameOpacity, edgeNameOpacity, faceNameOpacity } = useControls({
    edgeNameOpacity: { value: 1, min: 0, max: 1 },
    vertexNameOpacity: { value: 1, min: 0, max: 1 },
    faceNameOpacity: { value: 1, min: 0, max: 1 },
  });
  useEffect(() => {
    document.documentElement.style.setProperty('--edge-name-opacity', edgeNameOpacity.toString());
  }, [edgeNameOpacity]);
  useEffect(() => {
    document.documentElement.style.setProperty('--vertex-name-opacity', vertexNameOpacity.toString());
  }, [vertexNameOpacity]);
  useEffect(() => {
    document.documentElement.style.setProperty('--face-name-opacity', faceNameOpacity.toString());
  }, [faceNameOpacity]);

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
            <HelpPanel setPreset={setPreset} />

             <div style={{minHeight: "50px"}}></div>
            <div style={{width: "100%", borderWidth: "0px 0px 1px 0px", borderStyle: "solid", borderColor: "grey"}}></div>

            <div className={styles.upperPanel} style={{ display: 'flex', flexDirection: 'row' }}>
              {/* <DebugComplex complex={complex} /> */}
              <div className={styles.filePanel}>
                <LoadComplex setPreset={setPreset} />
                <ComplexSettings complexEditor={complexEditor} setAllowEditing={setAllowEditing} />
                <UIButton
                    name="save"
                    selected={false}
                    disabled={true}
                    onClick={() => {
                      downloadHistory(complexEditor.editorState.history);
                    }}
                >
                    <div>
                        <div style={{  minHeight: "35px", paddingTop: "5px"}}>
                            <Download />
                        </div>
                        
                    </div>
                    </UIButton>
              </div>
              <UIPanel
                complexEditor={complexEditor}
                setEditOptions={setEditOptions}
                editOptions={editOptions}
                setViewOptions={setViewOptions}
                viewOptions={{ nameState, gridStyle }}
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
            <div style={{width: "100%", borderWidth: "0px 0px 1px 0px", borderStyle: "solid", borderColor: "grey"}}></div>
              <div className={`${styles.lowerPanel} lowerPanel`} key={"COMPLEX"}>
                  <HomologyPanel complex={complexEditor.currentComplex}stepIndex={complexEditor.editorState.history.length - 1} />
              </div>
        </div>
      
      <div className="centerHolder">
        <History freezeIndex={editorState.freezeIndex} complexEditor={complexEditor} editorState={complexEditor.editorState} />

        <Board
          allowEditing={allowEditing} 
          viewOptions={viewOptions} 
          editOptions={editOptions} 
          editComplex={complexEditor}
          complex={complexEditor.currentComplex}
          stepIndex={complexEditor.editorState.history.length - 1}
          // selectedReps={complexEditor.selected}
        />
       
      </div>
      
    </div>
     <div className={styles.keybinds}>
          <div className={styles.keybindLabel}><div>a</div> add cell </div>
          <div className={styles.keybindLabel}><div>s</div> select </div>
        <div className={styles.keybindLabel}><div>m</div> trash </div>
          <div className={styles.keybindLabel}><div>d</div> delete </div>
          <div className={styles.keybindLabel}><div>f</div> fill </div>
          <div className={styles.keybindLabel}><div>i</div> identify </div>
          <div className={styles.keybindLabel}><div>[</div> lower grid </div>
          <div className={styles.keybindLabel}><div>]</div> raise grid </div>

          <div className={styles.keybindLabel}><div>ctrl</div><div>z</div> undo </div>
          <div className={styles.keybindLabel}><div>ctrl</div><div>a</div> select all </div>
          <div className={styles.keybindLabel}><div>ctrl</div><div>d</div> deselect all </div>
          <div className={styles.keybindLabel}><div>c</div> clear selection</div>
          <div className={styles.keybindLabel}><div>ctrl</div><div>g</div> toggle grid style</div>
        </div>
    </ErrorBoundary>
      </TutorialProvider>
      </ThemeProvider>
  );
}

export default App;
