import { useMemo, useState } from "react";
import { CWComplex, getVertices, madeWithGivenVertices, retrieveCellsFromSelectedKeys } from "../math/CWComplex";
import { MAX_DIMENSION, MAX_VERTEX_SELECT } from "../data/configuration";
const DEBUG = true;
const unique = (arr) => [...new Set(arr)];
// from the list, return the list of all c choices.
const choices = (v, c) => {
    let result = 1;
    for (let i = 0; i < c; i++) {
        result *= (v - i) / (i + 1);
    }
    return result;
};
const iterateChoice = (arr, c) => {
    if (c === 0) {
        return [[]];
    }
    if (c === 1) {
        return arr.map(a => [a]);
    }
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = iterateChoice(arr.slice(i + 1), c - 1);
        rest.forEach(r => result.push([arr[i], ...r]));
    }
    return result;
};
const transferSelected = function (complex, selected) {
    // when a new CWComplex is made, the cells are cloned. so they are no longer equal by reference
    const newSelected = new Set();
    selected.forEach(cell => {
        const [dimension_, id_] = cell.split(" ");
        const dimension = +dimension_;
        const id = +id_;
        const newCell = complex.cells[dimension].find(c => c.id === id);
        if (newCell) {
            newSelected.add(newCell);
        }
    });
    return newSelected;
};
export class CWComplexStateEditor {
    constructor(
    // private history_: CWComplexEditStep[], 
    setEditorState, history) {
        Object.defineProperty(this, "setEditorState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: setEditorState
        });
        Object.defineProperty(this, "history", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: history
        });
        // private selected - update on every change
        Object.defineProperty(this, "selected_", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "selectRep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (cell) => {
                this.setEditorState(({ history, selectedKeys, complex }) => {
                    const newSelected = new Set(selectedKeys);
                    newSelected.add(cell.key);
                    console.notify("Selecting", cell.key);
                    this.selected_ = transferSelected(complex, newSelected);
                    return {
                        history: history,
                        complex: complex,
                        selectedKeys: newSelected
                    };
                });
            }
        });
        this.setComplex = this.setComplex.bind(this);
        this.performVertexIdentification = this.performVertexIdentification.bind(this);
        this.performEdgeIdentification = this.performEdgeIdentification.bind(this);
        this.toggleRepSelection = this.toggleRepSelection.bind(this);
        this.addVertex = this.addVertex.bind(this);
        this.collapse = this.collapse.bind(this);
        this.addCell = this.addCell.bind(this);
        this.identify = this.identify.bind(this);
    }
    // get complex(): CWComplex {
    //     return this.history_[this.history_.length - 1].complex;
    // }
    get selected() {
        return new Set(this.selected_);
    }
    // get history(): CWComplexEditStep[] {
    //     return this.history_.map(copyStep);
    // }
    reset() {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            return {
                history: [{
                        type: "start",
                        step: () => new CWComplex(),
                        selectedKeys: new Set()
                    }],
                complex: new CWComplex(),
                selectedKeys: new Set()
            };
        });
    }
    ;
    setComplex(newComplex) {
        this.selected_ = new Set();
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const editStep = {
                type: "start",
                step: (complex) => { complex.assignFrom(newComplex); },
                selectedKeys: new Set()
            };
            if (DEBUG)
                console.log("NewStep", editStep);
            editStep.step(complex, selectedKeys);
            return {
                history: [editStep],
                complex: complex,
                selectedKeys: selectedKeys
            };
        });
    }
    identify() {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            if (selectedKeys.size === 0) {
                console.notify("Select some cells to identify");
                return { history, complex, selectedKeys };
            }
            const editStep = {
                type: "identify",
                selectedKeys: new Set(selectedKeys),
                step: (c, selectedKeys) => {
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    const dimension = [...selectedCells][0].dimension;
                    if (dimension === 0) {
                        c.identifyVertices(selectedCells);
                    }
                    else if (dimension === 1) {
                        c.identifyEdges(selectedCells);
                    }
                    else if (dimension === 2) {
                        // c.identifyFaces(selectedCells);
                    }
                    else {
                        throw new Error("Cannot identify balls");
                    }
                }
            };
            if (DEBUG)
                console.log("NewStep", editStep);
            try {
                editStep.step(complex, selectedKeys);
            }
            catch (e) {
                console.notify("Invalid selection for identification");
                throw e;
                return {
                    history: [...history],
                    complex: complex,
                    selectedKeys: selectedKeys
                };
            }
            return {
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys
            };
        });
    }
    performVertexIdentification() {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            // const selected = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            // complex.performVertexIdentification(selected);
            const editStep = {
                type: "identifyVertices",
                selectedKeys: new Set(selectedKeys),
                step: (c, selectedKeys) => {
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    c?.identifyVertices(selectedCells);
                }
            };
            if (DEBUG)
                console.log("NewStep", editStep);
            editStep.step(complex, selectedKeys);
            return {
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys
            };
        });
    }
    performEdgeIdentification() {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const selected = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            complex.identifyEdges(selected);
            const editStep = {
                type: "identifyEdges",
                selectedKeys: new Set(selectedKeys),
                step: (c, selectedKeys) => {
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    c.identifyEdges(selectedCells);
                    c.reindex();
                }
            };
            if (DEBUG)
                console.log("NewStep", editStep);
            return {
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys
            };
        });
    }
    addVertex(position, name) {
        console.count("addVertex");
        this.setEditorState(({ history, selectedKeys, complex }) => {
            // const complex = history[history.length - 1].complex;
            // const newComplex = complex.addVertex(position);
            const stepData = {
                type: "addVertex",
                step: (c) => {
                    c.addVertex([...position], name);
                },
                selectedKeys: new Set()
            };
            stepData.step(complex);
            if (DEBUG)
                console.log("addVertex", complex.size);
            return {
                history: [...history, stepData],
                complex: complex,
                selectedKeys: new Set(selectedKeys)
            };
        });
    }
    collapse() {
        // TODO
        // this.setHistory_(history => [...history])
    }
    addCell() {
        debugger;
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const keyList = [...selectedKeys];
            // use coboundaries to check for shit
            const step = function (complex, selectedKeys) {
                console.count("Performed add cell step");
                const allCellsList = [...retrieveCellsFromSelectedKeys(complex, selectedKeys)];
                const allVertices = unique(allCellsList.flatMap(getVertices));
                // sort vertices by id
                allVertices.sort((a, b) => a.id - b.id);
                if (allVertices.length > MAX_VERTEX_SELECT) {
                    console.notify("Fill", `Select 2-${MAX_VERTEX_SELECT} vertices to fill.`);
                    // return;
                }
                // What is the dimension of our new cells (higher cells, dim n)
                const cellDimension = Math.min(allVertices.length - 1, 3);
                let lowerCells = allVertices; // dim n - 1
                let addMore = true;
                for (let i = 0; (i < cellDimension) && addMore; i++) {
                    // Get those faces that may be part of the structure via the reverse attaching maps
                    const existingHigherCells = unique(lowerCells.flatMap(c => c.cob));
                    // Reduce to the set of faces that have all the vertices. These should all be considered
                    // all will be used except for duplicates
                    const contained = (f) => madeWithGivenVertices(f, allVertices);
                    const includedHigherCells = existingHigherCells.filter(contained);
                    // create a map of possible face summaries so that
                    // we can check if a face already exists where we want
                    const verticesListMap = new Map();
                    includedHigherCells.forEach(f => verticesListMap.set(f.vertexSummary, f));
                    const verticesSummarySet = new Set(verticesListMap.keys());
                    // for each point -> for eah face. if the face is not there, add it
                    const higherCells = iterateChoice(allVertices, i + 2).map((chosen, j) => {
                        const higherCells = includedHigherCells.filter(f => f.vertices.every(v => chosen.includes(v)));
                        const hypotheticalSummary = chosen.map(c => c.id).join(", ");
                        const face = verticesListMap.get(hypotheticalSummary);
                        if (face) {
                            return face;
                        }
                        else {
                            addMore = false;
                            const lowerFaces = chosen.map((_, i) => {
                                const faceVertices = chosen.filter((_, j) => i !== j);
                                const faceSummary = faceVertices.map(v => v.id).join(", ");
                                return lowerCells.find(c => c.vertexSummary === faceSummary);
                            });
                            return complex.add(lowerFaces.map(f => f.key), i + 1);
                        }
                    });
                    lowerCells = higherCells;
                }
            };
            const stepData = {
                step,
                type: "saturate",
                selectedKeys: new Set(selectedKeys),
            };
            if (step === null) {
                console;
                return { history, complex, selectedKeys };
            }
            const totalCellCount = complex.numCells;
            step(complex, selectedKeys);
            const newCellCount = complex.numCells;
            // if no new cells, don't bother adding a step
            if (totalCellCount === newCellCount) {
                return { history, complex, selectedKeys };
            }
            return {
                history: [...history, stepData],
                complex: complex,
                selectedKeys: new Set(selectedKeys)
            };
        });
    }
    deleteCells() {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const step = function (complex, selectedKeys) {
                const cells = retrieveCellsFromSelectedKeys(complex, selectedKeys);
                cells.forEach(c => complex.deleteCell(c));
            };
            const stepData = {
                step,
                type: "delete",
                selectedKeys,
            };
            step(complex, selectedKeys);
            return {
                history: [...history, stepData],
                complex: complex,
                selectedKeys: new Set()
            };
        });
    }
    deselectRep(cell) {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const newSelected = new Set(selectedKeys);
            newSelected.delete(cell.key);
            this.selected_ = transferSelected(complex, newSelected);
            return {
                history: history,
                complex: complex,
                selectedKeys: newSelected
            };
        });
    }
    toggleRepSelection(key) {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const newSelected = new Set(selectedKeys);
            //const key = cell.key;
            if (newSelected.has(key)) {
                newSelected.delete(key);
            }
            else {
                newSelected.add(key);
            }
            this.selected_ = transferSelected(complex, newSelected);
            return {
                history: history,
                complex: complex,
                selectedKeys: newSelected
            };
        });
    }
    deselectAll() {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            return {
                history: history,
                complex: complex,
                selectedKeys: new Set()
            };
        });
    }
    selectAll() {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            return {
                history: history,
                complex: complex,
                selectedKeys: new Set(Array(MAX_DIMENSION).fill(0).map((_, i) => complex.cells[i].map(c => c.key)).flat())
            };
        });
    }
    get center() {
        return [0, 0, 0];
    }
    jumpToStep(i) {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const newHistory = history.slice(0, i + 1);
            const newComplex = new CWComplex();
            newHistory.forEach(step => step.step(newComplex, step.selectedKeys));
            const latest = newHistory[newHistory.length - 1];
            this.selected_ = transferSelected(newComplex, latest.selectedKeys);
            return {
                history: newHistory,
                complex: newComplex,
                selectedKeys: latest.selectedKeys
            };
        });
    }
    undo() {
        console.warn("UNDO");
        this.setEditorState(({ history, selectedKeys, complex }) => {
            if (history.length === 1) {
                return { history, complex, selectedKeys };
            }
            const newHistory = history.slice(0, history.length - 1);
            const newComplex = new CWComplex();
            newHistory.forEach(step => {
                step.step(newComplex, step.selectedKeys);
            });
            const latest = newHistory[newHistory.length - 1];
            this.selected_ = transferSelected(newComplex, latest.selectedKeys);
            return {
                history: newHistory,
                complex: newComplex,
                selectedKeys: latest.selectedKeys
            };
        });
    }
    shiftSelection(dx, dy, dz) {
        this.setEditorState(({ history, selectedKeys, complex }) => {
            const newSelected = new Set(selectedKeys);
            const cells = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            console.notify("Total shifted", [...cells].length);
            // cells.forEach(c => c.shift(dx, dy, dz));
            // We changed a property of the cell, but to update it on react,
            // we need to change the key
            cells.forEach(c => newSelected.delete(c.key));
            cells.forEach(c => newSelected.add(c.key));
            this.selected_ = transferSelected(complex, newSelected);
            const stepData = {
                type: "shift",
                step: (c) => {
                    const cells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    cells.forEach(cell => cell.shift(dx, dy, dz));
                },
                selectedKeys: new Set(newSelected)
            };
            const newComplex = new CWComplex();
            newComplex.assignFrom(complex);
            stepData.step(newComplex);
            return {
                history: [...history, stepData],
                complex: newComplex,
                selectedKeys: newSelected
            };
            return {
                history: [...history, stepData],
                complex: complex,
                selectedKeys: newSelected
            };
        });
    }
}
export function useEditComplex(preset) {
    const [complexData, setComplexData] = useState({
        history: [{
                type: "start",
                step: () => new CWComplex(),
                selectedKeys: new Set()
            }],
        complex: new CWComplex(),
        selectedKeys: new Set(),
    });
    const { history, complex, selectedKeys } = complexData;
    const setHistory = (history) => {
        // now the history is steps - functions that map a complex to a new complex
        setComplexData(data => ({ ...data, history }));
    };
    const [selected, setSelected] = useState(new Set());
    const editComplex = useMemo(() => new CWComplexStateEditor(setComplexData, history), [setSelected, history]);
    // if (preset) {
    //     // preset(editComplex);
    // }
    // const latest = complex;
    return [{ history, complex, selectedKeys }, editComplex];
}
