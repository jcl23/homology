import { useEffect, useState } from "react";
import {  } from "../../node_modules/material-components-web/dist/material-components-web.min.css";
import styles from './UIPanel.module.css';
import buttonStyles from '../icon/Buttons.module.css';
import { EditOptions, ViewOptions } from "../App";
import { IconButton  } from "rmwc";
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import Button from "@mui/material/Button";
// import VertexAddButton from "../icon/vertexAddButton";

import { Icon } from "@mui/material";
import theme from "../style/theme";
import SelectButton from "../icon/SelectButton";
import TrashButton from "../icon/TrashButton";
import { CWComplexStateEditor, EditorState } from "../hooks/useCWComplexEditor";
import { CWComplex } from "../math/CWComplex";
import { SelectedState } from "../math/selectedState";
import VertexAddButton from "../icon/VertexAddButton";
import MoveButton from "../icon/MoveButton";
import UIButton from "../icon/UIButton";
import { MoveIcon } from "../assets/icons";
import { SelectAllIcon } from "../icon/SelectAllIcon";
import { ClearSelectionIcon } from "../icon/ClearSelectionIcon";
import { FillIcon } from "../icon/FillIcon";

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { IdentifyIcon } from "../icon/IdentifyIcon";
import UndoIcon from "../icon/UndoIcon";
import { ArrowCircleDown, ArrowCircleUp, ArrowRight, ResetTv, RestartAlt } from "@mui/icons-material";
import { RestartIcon } from "../icon/RestartIcon";

export type UIPanelProps = {
    setEditOptions: (mode: EditOptions) => void;
    editOptions: EditOptions;
    setViewOptions: (viewOptions: ViewOptions) => void;
    viewOptions: ViewOptions;
    complexEditor: CWComplexStateEditor;
    editorState: EditorState;
}

// type UIEditorState = {
//     mode: EditMode;
// }

const SelectButtons = (props: UIPanelProps) => {
    const { setEditOptions, editOptions, setViewOptions, viewOptions, complexEditor, editorState } = props;
    // const selectedState: SelectedState = classifySelected(editorState.selectedKeys);
    // const { selectionKey } = editOptions;
    const setEditMode = (mode: EditOptions["mode"]) => {
        setEditOptions({ ...editOptions, mode });
    }

    const setSelectionKey = (selectionKey: "index" | "id") => { 
        setEditOptions({ ...editOptions, selectionKey }); 
    }

    return (<>
        {/* <h6>Selection Key</h6> */}
        {/* <UIButton
            selected={false}
            onClick={() => setSelectionKey(selectionKey === "index" ? "id" : "index")}
        >
            {selectionKey}
        </UIButton> */}
        <UIButton
            name="all"
            selected={false}
            onClick={() => complexEditor.selectAll()}
            style={{marginTop: "auto"}}
        >
            <SelectAllIcon enabled={true}/>
        </UIButton>
        <UIButton
            name="none"
            selected={false}
            onClick={() => complexEditor.deselectAll()}
        >
            <ClearSelectionIcon enabled={true}/>
        </UIButton>
        
    </>)
}

;

const RightMoveButtons = (props: UIPanelProps) => {
    
    const moveIn = () => {
        props.complexEditor.shiftSelection(0, 0, 1);
    }
    const moveOut = () => {
        props.complexEditor.shiftSelection(0, 0, -1);
    }
    const moveLeft = () => {
        props.complexEditor.shiftSelection(-1, 0, 0);
    }
    const moveRight = () => {
        props.complexEditor.shiftSelection(1, 0, 0);
    }

    return (
        <>
            <UIButton name="right" selected={false} onClick={moveRight}  style={{marginTop: "auto"}}>
                <ArrowForwardIcon />
            </UIButton>
            <UIButton name="in" selected={false} onClick={moveIn}>
                <ArrowCircleUp />
            </UIButton>
            <UIButton name="out" selected={false} onClick={moveOut}>
                <ArrowCircleDown style={{fontWeight: "bold"}} />
            </UIButton>
        </>
    );
};

const LeftMoveButtons = (props: UIPanelProps) => {
    
    const moveUp = () => {
        props.complexEditor.shiftSelection(0, 1, 0);
    }
    const moveDown = () => {
        props.complexEditor.shiftSelection(0, -1, 0);
    }
    const moveLeft = () => {
        props.complexEditor.shiftSelection(-1, 0, 0);
    }
    const moveRight = () => {
        props.complexEditor.shiftSelection(1, 0, 0);
    }

    return (
        <>
            <UIButton name="left" selected={false} onClick={moveLeft}  style={{marginTop: "auto"}}>
                <ArrowBackIcon />
            </UIButton>
            <UIButton name="up" selected={false} onClick={moveUp}>
                <ArrowUpwardIcon />
            </UIButton>
            <UIButton name="down" selected={false} onClick={moveDown} >
                <ArrowDownwardIcon />
            </UIButton>
    </>
    );
};


const UIPanel = (props: UIPanelProps) => {
    const { setEditOptions, editOptions, setViewOptions, viewOptions, complexEditor, editorState } = props;
    const { nameState } = viewOptions;
    const { mode: editMode } = editOptions;

    const setEditMode = (mode: EditOptions["mode"]) => {
        setEditOptions({ ...editOptions, mode });
    }
    
    const setNameState = (nameState: boolean[]) => { 
        setViewOptions({ ...viewOptions, nameState });
    }

    const createSimplexLabel = [
        "Add Edge", "Add Face", "Add Cell"
    ]

    return (
        <div className={styles.panel + " ui-panel"}>
            <div className={styles.buttonColumn}>
                <div 
                    style={{
                        width: "50px",
                        height: "258px",
                        transform: "translateY(5px)",
                        position: "absolute"
                    }}
                    className="tour_mode_buttons"
                >   
                </div>

                {/* LEFT COLUMN */}
                <VertexAddButton selected={editMode == "add"} onClick={() => { complexEditor.deselectAll(); setEditMode("add")} }/>              
                <SelectButton selected={editMode == "select"} onClick={() => { complexEditor.deselectAll(); setEditMode("select")} }/>

                <MoveButton selected={editMode == "move"} onClick={() => { complexEditor.deselectAll(); setEditMode("move")} }/>

                <TrashButton selected={editMode == "remove"} onClick={() => { complexEditor.deselectAll(); setEditMode("remove")} }/>

            
                
                {
                    editMode === "select" ? (
                        <SelectButtons {...props} />
                    ) : null
                }
                {
                    editMode === "move" ? (
                        <LeftMoveButtons {...props} />
                    ) : null
                }
            </div>
            <div className={styles.buttonColumn}>
            {/* RIGHT COLUMN */}
                <UIButton 
                    name="fill"
                    onClick={complexEditor.addCell} selected={false}       
                >
                    <FillIcon enabled={true}/>
                </UIButton>
                <UIButton 
                    name="identify"
                    onClick={complexEditor.identify} selected={false}       
                    >
                    <IdentifyIcon enabled={true}/>
                </UIButton>
                 {/* undo redo */}
                <UIButton 
                    name="undo"
                    onClick={complexEditor.undo} selected={false}
                >
                    <UndoIcon enabled={true}/>
                </UIButton>
                <UIButton 
                    name="reset"
                    onClick={() => props.complexEditor.reset()}
                    selected={false}
                    >

                    <RestartIcon />
                </UIButton>
                {
                    editMode === "move" ? (
                        <RightMoveButtons {...props} />
                    ) : null
                }
                {/* <UIButton 
                    onClick={complexEditor.undo} selected={false}
                >
                    <UndoIcon enabled={true}/>
                </UIButton> */}
            </div>
            
            {[].map((dim) => (
            <button 
                key={dim} 
                className={nameState[dim] ? styles.selected : ""}
                onClick={() => {
                    const newNameState = [...nameState];
                    newNameState[dim] = !nameState[dim];
                    setNameState(newNameState);
                }}>

                    {["Vertex"," Edge"," Face"][dim]}
                </button>  
            ))}
        </div>
    );
}

export default UIPanel;
