import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './UIPanel.module.css';
import SelectButton from "../icon/SelectButton";
import TrashButton from "../icon/TrashButton";
import { classifySelected } from "../math/selectedState";
import VertexAddButton from "../icon/VertexAddButton";
import MoveButton from "../icon/MoveButton";
import UIButton from "../icon/UIButton";
import { SelectAllIcon } from "../icon/SelectAllIcon";
import { ClearSelectionIcon } from "../icon/ClearSelectionIcon";
import { FillIcon } from "../icon/FillIcon";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { IdentifyIcon } from "../icon/IdentifyIcon";
import UndoIcon from "../icon/UndoIcon";
import { ArrowCircleDown, ArrowCircleUp } from "@mui/icons-material";
import { RestartIcon } from "../icon/RestartIcon";
// type UIEditorState = {
//     mode: EditMode;
// }
const SelectButtons = (props) => {
    const { setEditOptions, editOptions, setViewOptions, viewOptions, complexEditor, editorState } = props;
    const selectedState = classifySelected(editorState.selectedKeys);
    const { selectionKey } = editOptions;
    const setEditMode = (mode) => {
        setEditOptions({ ...editOptions, mode });
    };
    const setSelectionKey = (selectionKey) => {
        setEditOptions({ ...editOptions, selectionKey });
    };
    return (_jsxs(_Fragment, { children: [_jsx(UIButton, { name: "all", selected: false, onClick: () => complexEditor.selectAll(), style: { marginTop: "auto" }, children: _jsx(SelectAllIcon, { enabled: true }) }), _jsx(UIButton, { name: "none", selected: false, onClick: () => complexEditor.deselectAll(), children: _jsx(ClearSelectionIcon, { enabled: true }) })] }));
};
const RightMoveButtons = (props) => {
    const moveIn = () => {
        props.complexEditor.shiftSelection(0, 0, 1);
    };
    const moveOut = () => {
        props.complexEditor.shiftSelection(0, 0, -1);
    };
    const moveLeft = () => {
        props.complexEditor.shiftSelection(-1, 0, 0);
    };
    const moveRight = () => {
        props.complexEditor.shiftSelection(1, 0, 0);
    };
    return (_jsxs(_Fragment, { children: [_jsx(UIButton, { name: "right", selected: false, onClick: moveRight, style: { marginTop: "auto" }, children: _jsx(ArrowForwardIcon, {}) }), _jsx(UIButton, { name: "in", selected: false, onClick: moveIn, children: _jsx(ArrowCircleUp, {}) }), _jsx(UIButton, { name: "out", selected: false, onClick: moveOut, children: _jsx(ArrowCircleDown, { style: { fontWeight: "bold" } }) })] }));
};
const LeftMoveButtons = (props) => {
    const moveUp = () => {
        props.complexEditor.shiftSelection(0, 1, 0);
    };
    const moveDown = () => {
        props.complexEditor.shiftSelection(0, -1, 0);
    };
    const moveLeft = () => {
        props.complexEditor.shiftSelection(-1, 0, 0);
    };
    const moveRight = () => {
        props.complexEditor.shiftSelection(1, 0, 0);
    };
    return (_jsxs(_Fragment, { children: [_jsx(UIButton, { name: "left", selected: false, onClick: moveLeft, style: { marginTop: "auto" }, children: _jsx(ArrowBackIcon, {}) }), _jsx(UIButton, { name: "up", selected: false, onClick: moveUp, children: _jsx(ArrowUpwardIcon, {}) }), _jsx(UIButton, { name: "down", selected: false, onClick: moveDown, children: _jsx(ArrowDownwardIcon, {}) })] }));
};
const UIPanel = (props) => {
    const { setEditOptions, editOptions, setViewOptions, viewOptions, complexEditor, editorState } = props;
    const { nameState } = viewOptions;
    const { mode: editMode } = editOptions;
    const setEditMode = (mode) => {
        setEditOptions({ ...editOptions, mode });
    };
    const setNameState = (nameState) => {
        setViewOptions({ ...viewOptions, nameState });
    };
    const createSimplexLabel = [
        "Add Edge", "Add Face", "Add Cell"
    ];
    return (_jsxs("div", { className: styles.panel, children: [_jsxs("div", { className: styles.buttonColumn, children: [_jsx(VertexAddButton, { selected: editMode == "add", onClick: () => { complexEditor.deselectAll(); setEditMode("add"); } }), _jsx(SelectButton, { selected: editMode == "select", onClick: () => { complexEditor.deselectAll(); setEditMode("select"); } }), _jsx(MoveButton, { selected: editMode == "move", onClick: () => { complexEditor.deselectAll(); setEditMode("move"); } }), _jsx(TrashButton, { selected: editMode == "remove", onClick: () => { complexEditor.deselectAll(); setEditMode("remove"); } }), editMode === "select" ? (_jsx(SelectButtons, { ...props })) : null, editMode === "move" ? (_jsx(LeftMoveButtons, { ...props })) : null] }), _jsxs("div", { className: styles.buttonColumn, children: [_jsx(UIButton, { name: "fill", onClick: complexEditor.addCell, selected: false, children: _jsx(FillIcon, { enabled: true }) }), _jsx(UIButton, { name: "identify", onClick: complexEditor.identify, selected: false, children: _jsx(IdentifyIcon, { enabled: true }) }), _jsx(UIButton, { name: "undo", onClick: complexEditor.undo, selected: false, children: _jsx(UndoIcon, { enabled: true }) }), _jsx(UIButton, { name: "reset", onClick: () => props.complexEditor.reset(), selected: false, children: _jsx(RestartIcon, {}) }), editMode === "move" ? (_jsx(RightMoveButtons, { ...props })) : null] }), [].map((dim) => (_jsx("button", { className: nameState[dim] ? styles.selected : "", onClick: () => {
                    const newNameState = [...nameState];
                    newNameState[dim] = !nameState[dim];
                    setNameState(newNameState);
                }, children: ["Vertex", " Edge", " Face"][dim] }, dim)))] }));
};
export default UIPanel;
