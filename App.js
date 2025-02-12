import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import "./App.css";
import UIPanel from "./comps/UIPanel";
import Board from "./comps/board/Board";
import { printSelected, retrieveCellsFromSelectedKeys } from "./math/CWComplex";
import SimplicesPanel from "./comps/board/simplicesPanel/SimplicesPanel";
import { defaultComplex } from "./data/presets";
import { HomologyPanel } from "./comps/HomologyPanel";
import { getChainGroups } from "./math/homology";
import { LoadComplex } from "./comps/modals/LoadComplex";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./style/theme";
import { useEditComplex } from "./hooks/useCWComplexEditor";
import { keybinds } from "./data/keybinds";
import { ErrorBoundary } from "./comps/ErrorBoundary";
import NotificationManager from "./comps/notifs/NotificationManager";
import TutorialModal from "./comps/tutorial/TutorialModal";
import History from "./comps/history/History";
import styles from "./App.module.css";
import { defaultPreset } from "./data/defaultComplexes";
import { HelpPanel } from "./comps/help/HelpPanel";
const MAX_DIM = 3;
function App() {
    // const [complex, setComplex] = useState<CWComplex>({ cells: { 0: [], 1: [], 2: [] } });
    //const [clickSimplex, setClickSimplex] = useState<(s: AbstractCell) => void>(() => () => {});
    const [editOptions, setEditOptions] = useState({
        mode: "select",
        selectionKey: "index",
        gridHeight: 0,
        isMouseDown: false,
        dimSelected: -1
    });
    const { mode, selectionKey } = editOptions;
    const [viewOptions, setViewOptions] = useState({
        nameState: [true, true, true, true],
        lastTarget: [0, 0, 0]
    });
    const { nameState } = viewOptions;
    const [preset, setPreset] = useState(defaultComplex);
    // const [startingComplex, setStartingComplex] = useState<CWComplex>(defaultComplex.complex);
    const [editorState, complexEditor] = useEditComplex();
    useEffect(() => {
        complexEditor.reset();
        defaultPreset(complexEditor);
    }, [defaultPreset]);
    // useMemo(() => {  
    //   return useEditComplex(defaultPreset);
    // }, []);
    const { selectedKeys, complex } = editorState;
    const selectedRepresentatives = retrieveCellsFromSelectedKeys(complex, selectedKeys);
    const selectedRepList = [...selectedRepresentatives];
    console.notify("NumSelected", selectedRepList.length);
    const selectedVertexReps = new Set(selectedRepList.filter((cell) => cell.dimension === 0));
    const selectedEdgeReps = new Set(selectedRepList.filter((cell) => cell.dimension === 1));
    const selectedFaceReps = new Set(selectedRepList.filter((cell) => cell.dimension === 2));
    const cellCounts = getChainGroups(complex);
    ///  const selectedBalls = selectedCellList.filter((cell) => cell.dimension === 3);
    const noneSelected = selectedRepList.length === 0;
    const onlyVerticesSelected = selectedVertexReps.size > 0 && selectedEdgeReps.size === 0 && selectedFaceReps.size === 0;
    const onlyEdgesSelected = selectedVertexReps.size === 0 && selectedEdgeReps.size > 0 && selectedFaceReps.size === 0;
    const onlyFacesSelected = selectedVertexReps.size === 0 && selectedEdgeReps.size === 0 && selectedFaceReps.size > 0;
    // With useEffect, log the states of selectedCells and complex
    React.useEffect(() => {
        // console.log("Selected cells");
        console.log(printSelected(complex, new Set(selectedRepList)));
        // console.log("Whole complex");
        // printCWComplex(complex);
    }, [selectedRepList]);
    const selectedState = (noneSelected ? "none"
        : onlyVerticesSelected ? "verticesOnly"
            : onlyEdgesSelected ? "edgesOnly"
                : onlyFacesSelected ? "facesOnly"
                    : "other");
    useEffect(() => {
        // State to track Shift and Control keys
        let isShiftPressed = false;
        let isControlPressed = false;
        const handleKeydown = (event) => {
            if (event.repeat) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            ;
            if (event.key === 'Shift') {
                isShiftPressed = true;
                console.warn("Shift pressed");
                setEditOptions((prev) => ({ ...prev, mode: "move" }));
                return;
            }
            else if (event.key === 'Control') {
                isControlPressed = true;
                console.warn("Control pressed");
                return;
            }
            else {
                if (event.ctrlKey || event.shiftKey) {
                    event.preventDefault();
                }
            }
            // if (isControlPressed) {
            // //   event.preventDefault()
            //   isControlPressed = true;
            // }
            console.log("Called function for ", event.key);
            const keyCombination = `${event.ctrlKey ? 'Ctrl' : ''}${event.shiftKey ? 'Shift' : ''}${event.key}`;
            const func = keybinds?.[keyCombination];
            if (func) {
                func(complexEditor, setEditOptions, setViewOptions);
            }
        };
        const handleKeyup = (event) => {
            if (event.key === 'Shift') {
                setEditOptions((prev) => ({ ...prev, mode: "select" }));
                isShiftPressed = false;
            }
            if (event.key === 'Control')
                isControlPressed = false;
        };
        // Attach keydown and keyup event listeners
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyup);
        // Cleanup on unmount
        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('keyup', handleKeyup);
        };
    }, [editorState]);
    useEffect(() => {
        // If the mode is delete, delete the selected cells
        if (mode === "remove") {
            // performActionOnSelectedReps((cell) => {throw new Error("Pluh")});
        }
    }, [selectedState]);
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(NotificationManager, {}), _jsxs(ErrorBoundary, { children: [_jsx(TutorialModal, {}), _jsxs("div", { className: "board", children: [_jsxs("div", { className: styles.panelHolder, children: [_jsx(HelpPanel, {}), _jsxs("div", { className: styles.upperPanel, style: { display: 'flex', flexDirection: 'row' }, children: [_jsx(LoadComplex, { setPreset: setPreset }), _jsx(UIPanel, { complexEditor: complexEditor, setEditOptions: setEditOptions, editOptions: editOptions, setViewOptions: setViewOptions, viewOptions: { nameState }, editorState: editorState }), _jsx(SimplicesPanel, { selectionKey: selectionKey, complex: complex, selectedKeys: selectedKeys, selectRep: complexEditor.selectRep, unselectRep: complexEditor.toggleRepSelection })] }), _jsx("div", { className: styles.lowerPanel, children: _jsx(HomologyPanel, { complex: complex }) }, "COMPLEX")] }), _jsxs("div", { className: "centerHolder", children: [_jsx(History, { complexEditor: complexEditor, editorState: editorState }), _jsx(Board, { viewOptions: viewOptions, editOptions: editOptions, editComplex: complexEditor, complex: complex, selectedReps: selectedKeys })] })] })] })] }));
}
export default App;
