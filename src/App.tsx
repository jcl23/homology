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
import { KeybindsModal } from "./comps/modals/Keybinds.tsx";
import { defaultEditOptions, defaultViewOptions, EditOptions, ViewOptions } from "./options.ts";

const MAX_DIM = 3;




function App() {
  
  
  const [allowEditing, setAllowEditing] = useState(true);
  const [ editOptions, setEditOptions] = useState<EditOptions>(defaultEditOptions);
  const [ viewOptions, setViewOptions] = useState<ViewOptions>(defaultViewOptions);

  const [preset, setPreset] = useState<Preset>(() => defaultComplex);
  
  const [editorState, complexEditor] = useEditComplex();
  
  useEffect(() => {
    complexEditor.reset();
    preset(complexEditor);
    complexEditor.deselectAll();
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
    document.documentElement.style.setProperty('--vertex-name-opacity', vertexNameOpacity.toString());
    document.documentElement.style.setProperty('--face-name-opacity', faceNameOpacity.toString());
  }, [edgeNameOpacity, vertexNameOpacity, faceNameOpacity]);

  return (
    <ThemeProvider theme={theme}>
      <TutorialProvider
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
                    <KeybindsModal />
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
        
    </ErrorBoundary>
      </TutorialProvider>
      </ThemeProvider>
  );
}

export default App;
