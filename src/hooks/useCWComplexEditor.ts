import { useMemo, useState } from "react";
import { CWComplex, ComplexMeta, copyStep, getBoundary, getBoundaryOfCell, getVertices, madeWithGivenVertices, retrieveCellsFromSelectedKeys } from "../math/CWComplex";
import { AbstractCell, Cell, Edge,summarize,Vertex } from "../math/classes/cells";
import { CWComplexEditStep, EditType  } from "../logic/steps";
import { MAX_DIMENSION, MAX_VERTEX_SELECT} from "../data/configuration";
import { ThermostatOutlined, ThumbUpSharp } from "@mui/icons-material";
import { Ray } from "three";
import { InvalidIdentificationError, TransformationError } from "../errors/errors";
import { Preset } from "../data/presets";

type CellIdentifier = {
    id: string; // all unique
    index: number; // a poset map from IDs
    name?: string; // a human readable name
}
type ComplexHistorySetter = React.Dispatch<React.SetStateAction<EditorState>>;

const DEBUG = true;

const unique = <T>(arr: T[]): T[] => [...new Set(arr)];
// from the list, return the list of all c choices.

const choices = (v: number, c: number): number => {
    let result = 1;
    for (let i = 0; i < c; i++) {
        result *= (v - i) / (i + 1);
    }
    return result;
}
const iterateChoice = <T>(arr: T[], c: number): T[][] => {
    if (c === 0) {
        return [[]];
    }
    if (c === 1) {
        return arr.map(a => [a]);
    }
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = iterateChoice(arr.slice(i + 1), c - 1);
        rest.forEach(r => result.push([arr[i], ...r]));
    }
    return result;
}
const transferSelected = function(complex: CWComplex, selected: string[]): Set<AbstractCell> {
    // when a new CWComplex is made, the cells are cloned. so they are no longer equal by reference
    const newSelected = new Set<AbstractCell>();
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
}


export type LastSelect = {
    lastClickedDepth: number;
    cellList: string;
}

export class CWComplexStateEditor  {
    constructor(
        // private history_: CWComplexEditStep[], 
        private setEditorState: ComplexHistorySetter,
        public editorState: EditorState,
        private nameMode: "letter" | "number" = "letter",
        // private history: CWComplexEditStep[],
        
    ) { 
        this.setComplex = this.setComplex.bind(this);
        this.getCell = this.getCell.bind(this);
        this.setEditorState = this.setEditorState.bind(this);
        this.performVertexIdentification = this.performVertexIdentification.bind(this);
        this.performEdgeIdentification = this.performEdgeIdentification.bind(this);
        this.toggleRepSelection = this.toggleRepSelection.bind(this);
        this.addVertex = this.addVertex.bind(this);
        this.collapse = this.collapse.bind(this);
        this.addCell = this.addCell.bind(this);
        this.identify = this.identify.bind(this);
        this.undo = this.undo.bind(this);
        this.reset = this.reset.bind(this);
        this.makeName = this.makeName.bind(this);
        this.setNameByIndex = this.setNameByIndex.bind(this);
    }
    
    setFreeze() {
        this.setEditorState((state) => ({...state, freezeIndex: state.history.length - 1}) );
    }

    get recentlySelected(): LastSelect{
        return this.editorState.lastSelect;
    }
        
    get currentComplex(): CWComplex {
        return this.editorState.complex;
    }

    get selected(): Set<AbstractCell> {
        return new Set([...this.editorState.selectedKeys].map(this.getCell));
    }

    get meta(): ComplexMeta {
        return this.editorState.meta;
    }

    private makeName(cell?: Cell) {
        if (this.nameMode === "letter") {
            // the first letter of the alphabet not currently used
            if (!cell || cell.dimension === 0) {
                const usedLetters = new Set(this.currentComplex.cells[0].map(c => c.name));
                let letter = "a";
                while (usedLetters.has(letter)) {
                    letter = String.fromCharCode(letter.charCodeAt(0) + 1);
                }
                return letter;
            } else {
                return cell.vertices.reduce((acc, v) => {
                    const letter = v.name ?? "a";
                    return acc + "," + letter;
                }, "").slice(1);
            } 
            // else {
            //     const d = cell.dimension;
            //     // the capital correspnding to how many cells there are (A=0, B=1, C=2, ...
            //     const usedLetters = new Set(this.currentComplex.cells[d].map(c => c.name));
            //     let letter = "A";
            //     while (usedLetters.has(letter)) {
            //         letter = String.fromCharCode(letter.charCodeAt(0) + 1);
            //     }
            //     return letter;
                
            // }
        } else {
            // the first number not currently used
            const usedNumbers = new Set(this.currentComplex.cells[cell.dimension].map(c => c.index));
            let number = 0;
            while (usedNumbers.has(number)) {
                number++;
            }
            return "" + number;
        }
    }
    renameMany(pairs: [string, string][]) {
        // Batch rename multiple cells
        this.setEditorState(({complex, ...state}) => {
            for (const [from, to] of pairs) {
                for (let d = 0; d < MAX_DIMENSION; d++) {
                    for (const cell of complex.cells[d]) {
                        if (cell.name === from) {
                            cell.name = to;
                        }
                    }
                }
            }
            
            return {
                ...state,
                complex
            };
        });
    }
    setNameByIndex(dimension: number, index: number, to: string) {
        
        // set all of them
        this.setEditorState(({complex, ...state}) => {
            const cells = complex.cells[dimension];
            const cellsWithIndex = cells.filter(c => c.index === index);
            if (cellsWithIndex.length === 0) {
                console.notify("No cell found with index " + index + " in dimension " + dimension);
                return;
            }
            // for all the cells with the index, set the name
            for (const cell of cellsWithIndex) {
                cell.name = to;
            }
            return {
                ...state,
                complex
            };
        });
    }
    rename(from: string, to: string) {
        const complex = this.editorState.complex;
        
        // Force a UI update by updating the editor state with the same complex
        this.setEditorState(({complex, ...state}) => {
            let found = false;
        // Find all cells with the 'from' name
        for (let d = 0; d < MAX_DIMENSION; d++) {
            for (const cell of complex.cells[d]) {
                if (cell.name === from) {
                    cell.name = to;
                    found = true;
                }
            }
        }
        if (!found) {
            console.log(complex.cells[2])
            throw new Error("Nothing found to rename")
        }
          return {
              ...state,
            complex
        }
        });
    }
    

    getCell(key: string): AbstractCell | undefined {
        if (!key) {
            return undefined;
        }
        const [dimension, id] = key.split(" ");
        const dim = +dimension;
        const id_ = +id;
        return this.editorState.complex.cells[dim].find(c => c.id === id_);
    }
    get cells(): AbstractCell[][] {
        return [
            this.editorState.complex.cells[0],
            this.editorState.complex.cells[1],
            this.editorState.complex.cells[2],
            this.editorState.complex.cells[3]
        ]
    }
    // get history(): CWComplexEditStep[] {
    //     return this.history_.map(copyStep);
    // }
    setMeta(newMeta: ComplexMeta): void {
        // no edit step, just update the meta
        this.setEditorState((editorState: EditorState) => {
            // apply props of meta argument to existing
            const meta = { ...editorState.meta, ...newMeta };
            return {
                ...editorState,
                meta,
            };
        });
    }
    reset(): void {
        this.setEditorState((editorState: EditorState) => {
            return {
                ...editorState,
                freezeIndex: -1,
                history: [{ 
                    type: "start", 
                    step: () => {}, 
                    selectedKeys: [],
                    args: [],
                }], 
                complex: new CWComplex(),
                selectedKeys: [],
                meta: makeDefaultMeta(),
                lastSelect: { lastClickedDepth: -1, cellList: "" },
            };
    })};
    setComplex(newComplex: CWComplex): void {
        this.setEditorState((editorState: EditorState) => {
            const { complex, selectedKeys, meta, lastSelect } = editorState;
                const editStep: CWComplexEditStep = {
                    args: [],
                    type: "start",
                    step: (complex: CWComplex) => {complex.assignFrom(newComplex)},
                    selectedKeys: []
                };
                if (DEBUG) console.log("NewStep", editStep);
                editStep.step(complex, selectedKeys);
                return {
                    ...editorState,
                    history: [editStep],
                    complex: complex,
                    selectedKeys: [],
                    meta,
                    lastSelect: { lastClickedDepth: -1, cellList: ""  }
                };
            }
        );
    }
    identifyNamedCells(names: string[], rename: boolean = true, newName?: string): void {
        this.setEditorState((editorState: EditorState) => {
            const { history, selectedKeys, complex, meta, lastSelect } = editorState;
            const editStep: CWComplexEditStep = { 
                args: [],
                type: "identify",
                selectedKeys: [...selectedKeys],
                step: (c: CWComplex, selectedKeys?: string[]) => { 
                    c.identifyNamedCells(names, rename, newName);
                }
            };
            if (DEBUG) console.log("NewStep", editStep);
            editStep.step(complex, selectedKeys);
            return {
                ...editorState,

                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys,
            };
        });
        
    }
    identify(renameCells = true): void {
        this.setEditorState((editorState: EditorState) => {
            const { complex, history, selectedKeys } = editorState;
            if (selectedKeys.length === 0) {
                console.notify("Select some cells to identify");
                return { ...editorState  };
            }
            
            const editStep: CWComplexEditStep = { 
                args: [],
                type: "identify",
                selectedKeys: [...selectedKeys],
                step: (c: CWComplex, selectedKeys?: string[])  => { 
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    
                    const dimension = [...selectedCells][0].dimension;
                    c.identifyCells(selectedCells, renameCells, selectedCells[0].name);
                    // if (dimension === 0) {
                    //     c.identifyVertices(selectedCells);
                    // } else if (dimension === 1) {
                    //     c.identifyEdges(selectedCells);
                    // } else if (dimension === 2) {
                    //    // c.identifyFaces(selectedCells);
                    // } else {
                    //     throw new Error("Cannot identify balls");    
                    // }
                }
            };
            if (DEBUG) console.log("NewStep", editStep);
            try {
                editStep.step(complex, selectedKeys);
            } catch (e) {
                console.notify("Invalid selection for identification");
                throw new InvalidIdentificationError(complex, e);
            }
            return {
                ...editorState,
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys,
            };
        });
    }
    duplicate(): void {
        // Duplicate the selected cells, giving them new IDs and names.
        this.setEditorState((editorState: EditorState) => {
            // if (selectedKeys.size === 0) {
            //     console.notify("Select some cells to duplicate");
            //     return { history, complex, selectedKeys, meta, lastSelect };
            // }
            const { selectedKeys, history, complex } = editorState;
            const editStep: CWComplexEditStep = { 
                args: [],
                type: "duplicate",
                selectedKeys: [...selectedKeys],
                step: (c: CWComplex, selectedKeys?: string[]) => { 
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    c.join(c.copy());
                }
            };
            if (DEBUG) console.log("NewStep", editStep);
            editStep.step(complex, selectedKeys);
            return {
                ...editorState,
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys,

            };
        });
    }

    performVertexIdentification(): void {
        this.setEditorState((editorState: EditorState) => {
            // const selected = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            // complex.performVertexIdentification(selected);
            const { selectedKeys, complex, history} = editorState;
            const editStep: CWComplexEditStep = { 
                args: [],
                type: "identifyVertices",
                selectedKeys: [...selectedKeys],
                step: (c: CWComplex, selectedKeys?: string[]) => { 
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    c?.identifyVertices(selectedCells) }
            };
            if (DEBUG) console.log("NewStep", editStep);
            
            editStep.step(complex, selectedKeys);
            return {
                ...editorState,
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys,
            };
        });
    }

    performEdgeIdentification(): void {
        this.setEditorState((editorState: EditorState) => {
            const { selectedKeys, complex, history} = editorState;

            const selected = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            complex.identifyEdges(selected);
            const editStep: CWComplexEditStep = { 
                args: [],
                type: "identifyEdges",
                selectedKeys: [...selectedKeys],
                step: (c: CWComplex, selectedKeys?: string[]) => { 
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    c.identifyEdges(selectedCells);
                    c.reindex(); 
                }
            };
            if (DEBUG) console.log("NewStep", editStep);
            return {
                ...editorState, 
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys,
                
            };
        });
    }
    addVertex(position: [number, number, number], name?: string): Vertex {
        if (!name) name = "" + this.makeName();
        console.count("addVertex");
        let vertex: Vertex;
        this.setEditorState((state: EditorState) => {

            const { history, selectedKeys, complex, meta, lastSelect } = state;
            const stepData: CWComplexEditStep = { 
                type: "addVertex",
                args: [...[position], name], 
                step: (c: CWComplex) => { 
                    return c.addVertex([...position], name); 
                },
                selectedKeys: []
            };
            vertex = stepData.step(complex) as Vertex;
            if (DEBUG) console.log("addVertex", complex.size);
            return {
                ...state,
                history: [...history, stepData],
                selectedKeys: [...selectedKeys],
            };
        });
        return vertex;
    }
    collapse(): void {
        // TODO
        // this.setHistory_(history => [...history])
    }

    addCell() {
        const makeName = this.makeName;
        const newCells:  Cell[] = [];
        this.setEditorState((editorState: EditorState) => {
            const { history, selectedKeys, complex, meta, lastSelect } = editorState;
            const keyList = [...selectedKeys];
            // use coboundaries to check for shit
            const step = function(complex: CWComplex, selectedKeys?: string[]) {
                console.count("Performed add cell step")
                const allCellsList: AbstractCell[] = [...retrieveCellsFromSelectedKeys(complex, selectedKeys)];
          
                const allVertices = unique(allCellsList.flatMap(getVertices));

        
                // sort vertices by id
                 allVertices.sort((a, b) => a.index - b.index);
                if (allVertices.length > MAX_VERTEX_SELECT) {
                    console.notify("Fill", `Select 2-${MAX_VERTEX_SELECT} vertices to fill.`)
                    // return;
                }
                // What is the dimension of our new cells (higher cells, dim n)
                const cellDimension = Math.min(allVertices.length - 1, 3);
                let lowerCells: AbstractCell[] = allVertices; // dim n - 1
                let addMore = true;
                for (let i = 0; (i < cellDimension) && addMore; i++) {
                    // Get those faces that may be part of the structure via the reverse attaching maps
                    const higherCellsNotUnique = lowerCells.flatMap(c => c.cob);
                    const existingHigherCells = unique(higherCellsNotUnique);

                    // Reduce to the set of faces that have all the vertices. These should all be considered
                    // all will be used except for duplicates
                    const contained = (f: AbstractCell) => madeWithGivenVertices(f, allVertices)
                    const includedHigherCells = existingHigherCells.filter(contained);

                    // create a map of possible face summaries so that
                    // we can check if a face already exists where we want
                    const verticesListMap = new Map<string, AbstractCell>();
                    includedHigherCells.forEach(f => verticesListMap.set(f.vertexSummary, f));
                    
                    const verticesSummarySet = new Set(verticesListMap.keys());
                    // for each point -> for eah face. if the face is not there, add it
                    const higherCells = iterateChoice(allVertices, i + 2).map(function(chosen, j)  {
                        const higherCells = includedHigherCells.filter(f => f.vertices.every(v => chosen.includes(v)));
                        const hypotheticalSummary = summarize(chosen);
                        const face = verticesListMap.get(hypotheticalSummary);
                        
                        if (face) {
                            return face;
                        } else {
                            addMore = false;
                            const lowerFaces = chosen.map((_, i) => {
                                const faceVertices = chosen.filter((_, j) => i !== j);
                                const faceSummary = summarize(faceVertices);
                                return lowerCells.find(c => c.vertexSummary === faceSummary)!;
                            });

                            const cell = complex.add(lowerFaces.map(f => f.key), i + 1, makeName);
                            if (cell.vertexSummary == "51") {
                             
                                cell.vertices
                            }
                            newCells.push(cell);
                            return cell;
                        }
                    });
                   
                    lowerCells = higherCells;
                }
            }
            
            const stepData: CWComplexEditStep = {
                args: [],
                step,
                type: "saturate",
                selectedKeys: [...selectedKeys],
            }
            
            if (step === null) {
                return { ...editorState };
            }
            const totalCellCount = complex.numReps;
            step(complex, selectedKeys);
            const newCellCount = complex.numReps;

            // if no new cells, don't bother adding a step
            if (totalCellCount === newCellCount) {
                return { history, complex, ...editorState };
            }

            return {
                ...editorState,
                history: [...history, stepData],
                complex: complex,
                selectedKeys: [...selectedKeys],
                meta,
                lastSelect
            };
        });
        return newCells;
    }

    deleteCells() {
        this.setEditorState((editorState: EditorState) => {
            const { selectedKeys, complex, history} = editorState;

            const step = function(complex: CWComplex, selectedKeys?: string[]) {
                const cells = retrieveCellsFromSelectedKeys(complex, selectedKeys);
                cells.forEach(c => complex.deleteCell(c));
            };
            const stepData: CWComplexEditStep = {
                args: [],
                step,
                type: "delete",
                selectedKeys,
            }
            step(complex, selectedKeys);
            return {
                ...editorState,
                history: [...history, stepData],
                complex: complex,
                selectedKeys: [],
            };
        });
    }
    
    
    selectRep = (key: string): void => {
         this.setEditorState((editorState: EditorState) => {
            const { selectedKeys } = editorState;

            const newSelected = [...selectedKeys];
            const keys = key.split(",");
            keys.forEach(k => {
                newSelected.push(k.trim());
            });
            console.notify("Selecting", key);
            // this.selected_ = transferSelected(complex, newSelected);

            return {
                ...editorState,
                selectedKeys: newSelected,
            }
        });
    }
    setSelected = (newSelected: AbstractCell[]): void => {
        const selectedKeys = newSelected.map(c => c.key);
        this.setEditorState((editorState: EditorState) => {
            // this.selected_ = transferSelected(complex, newSelected);
            return {
                ...editorState,
                selectedKeys,
            }
        });
    }
    setSelectedById = (newSelected: string): void => {
        const selectedKeys = newSelected.split(",").map(s => s.trim()).filter(s => s.length > 0);
        this.setEditorState((editorState: EditorState) => {
            // this.selected_ = transferSelected(complex, newSelected);
            return {
                ...editorState,
                selectedKeys,
            }
        });
    }
    selectByName = (name: string): void => {


        this.setEditorState((editorState: EditorState) => {
            const { complex, selectedKeys } = editorState;
            const reps = complex.getRepsByName(name);
            if (reps.length === 0) {
                console.notify(`No cells with name '${name}' found`);
                return;
            }
                
            const newSelected = [...selectedKeys];
            reps.forEach(rep => newSelected.push(rep.key));
            // this.selected_ = transferSelected(complex, newSelected);
            return {
                ...editorState,
                selectedKeys: newSelected,
            }
        });
    }
    selectIndex = (dimension: number, index: number): void => {
        
        this.setEditorState((editorState: EditorState) => {
            const { selectedKeys, complex } = editorState;
            const cells = complex.cells[dimension].filter(c => c.index === index);
            if (cells.length === 0) {
                console.notify(`No cells of dimension ${dimension} and index ${index} found`);
                return;
            }
            const newSelected = [...selectedKeys];
            cells.forEach(c => newSelected.push(c.key));
            // this.selected_ = transferSelected(complex, newSelected);
            return {
                ...editorState,
                selectedKeys: newSelected,
            }
        });
    }
    deselectIndex(dimension: number, index: number): void {
        const cells = this.editorState.complex.cells[dimension].filter(c => c.index === index);
        this.setEditorState((editorState: EditorState) => {
            const { selectedKeys } = editorState;
            const newSelected = [...selectedKeys];
            const keysToRemove = cells.map(c => c.key);
            const newSelectedFiltered = newSelected.filter(key => !keysToRemove.includes(key));
            return {
                ...editorState,
                selectedKeys: newSelectedFiltered,
            }
            // this.selected_ = transferSelected(complex, newSelected);

        }); 
    }
    deselectRep(key: string): void {
        this.setEditorState((editorState: EditorState) => {
            const { selectedKeys } = editorState;
            const newSelected = [...selectedKeys];
            const index = newSelected.indexOf(key);
            if (index > -1) {
                newSelected.splice(index, 1);
            }

            // this.selected_ = transferSelected(complex, newSelected);
            return {
                ...editorState,
                selectedKeys: newSelected,
            }
        });
    }
    toggleRepsSelection(cells: AbstractCell[]): void {
        if (cells.length === 0) {
            console.notify("No cells to toggle selection");
            return;
        } else if (cells.length === 1) {
            this.toggleRepSelection(cells[0].key);
            return;
        }
        const cellList = cells.map(c => c.key).join(", ");
        this.setEditorState((editorState: EditorState) => {
            const { selectedKeys, lastSelect } = editorState;
            const {lastClickedDepth, cellList: lastCellList } = lastSelect;
            const newSelected = [...selectedKeys];
            const toggle = (key: string) => {
                if (key == null) {
                    throw new Error("Tried to flip null cell");
                }
                const index = newSelected.indexOf(key);
                if (index > -1) {
                    newSelected.splice(index, 1);
                }
                else {
                    newSelected.push(key);
                }
            }
            // If this is the same set of cells we saw before, rotate.
            // If not, then set it to the one on top, set new lastSelect set.
            if (cellList === lastCellList) {
                const nextIndex = (lastClickedDepth + 1) % cells.length;
                if (lastClickedDepth >= 0) toggle(cells[lastClickedDepth].key);
                toggle(cells[nextIndex].key);

                return {
                    ...editorState,
                    selectedKeys: newSelected,
                    lastSelect: {
                        lastClickedDepth: nextIndex,
                        cellList
                    }
                }
            } else {
                toggle(cells[0].key);
                return {
                    ...editorState,
                    selectedKeys: newSelected,
                    lastSelect: {
                        lastClickedDepth: 0,
                        cellList,
                    }
                }
            }
        });
    }
    toggleRepSelection(key: string): void { 
        this.setEditorState((editorState: EditorState) => {
            const { selectedKeys, complex } = editorState;
            const newSelected = [...selectedKeys];
            const cell = this.getCell(key);

            const dimension = +key.split(" ")[0];
            const rest = complex.cells[dimension].filter(c => c.index == cell?.index);
            if (newSelected.includes(key)) {
                const index = newSelected.indexOf(key);
                if (index > -1) {
                    newSelected.splice(index, 1);
                }
                rest.forEach(c => {
                    const i = newSelected.indexOf(c.key);
                    if (i > -1) {
                        newSelected.splice(i, 1);
                    }
                });
            } else {
                newSelected.push(key);
                rest.forEach(c => {
                    if (!newSelected.includes(c.key)) {
                        newSelected.push(c.key);
                    }
                });
            }


            // this.selected_ = transferSelected(complex, newSelected);
            return {
                ...editorState,
                complex, selectedKeys: newSelected
            }
        });
    }

    deselectAll(): void {
        this.setEditorState((editorState: EditorState) => {
            return {
                ...editorState,  
                selectedKeys: [],
            }
        });
    }

    selectAll(): void {
        this.setEditorState((editorState: EditorState) => {
            const { complex } = editorState;
            return {
                ...editorState,
                selectedKeys: Array(MAX_DIMENSION).fill(0).map((_, i) => complex.cells[i].map(c => c.key)).flat(),
            }
        });
    }

    get center(): [number, number, number] {
        return [0, 0, 0];
    }

    jumpToStep(i: number): void {
        this.setEditorState((editorState: EditorState) => {
            const { history, meta, lastSelect } = editorState;
            const newHistory = history.slice(0, i + 1);
            const newComplex = new CWComplex();
            newHistory.forEach(step => step.step(newComplex, step.selectedKeys));
            const latest = newHistory[newHistory.length - 1];
            // this.selected_ = transferSelected(newComplex, latest.selectedKeys);
            return {
                ...editorState,
                history: newHistory,
                complex: newComplex,
                selectedKeys: latest.selectedKeys,
                lastSelect: { lastClickedDepth: -1, cellList: ""}
            };
        });
        
    }
    undo(): void {
        this.goBackTo(-1);
    }
    goBackTo(n: number): void {
        console.warn("UNDO");
        const { history } = this.editorState;
        const maxIndex = n < 0 ? history.length + n : n + 1;
        if (maxIndex <= this.editorState.freezeIndex) return;
        if (history.length === 1) {
            return;
        }
        this.setEditorState((editorState: EditorState) => {
            const newHistory = history.slice(0, maxIndex);
            const newComplex = new CWComplex();
            newHistory.forEach(step => {
                step.step(newComplex, step.selectedKeys);
            });
            const latest = newHistory[newHistory.length - 1];
            // this.selected_ = transferSelected(newComplex, latest.selectedKeys);
            return {
                ...editorState,
                history: newHistory,
                complex: newComplex,
                selectedKeys: latest.selectedKeys,
                lastSelect: { lastClickedDepth: -1, cellList: ""}
            };
        });
    }

    shiftSelection(dx: number, dy: number, dz: number): void {
        if (this.editorState.selectedKeys.length == 0) return;
        this.setEditorState((editorState: EditorState) => {
            const { complex, selectedKeys, history } = editorState;
            const newSelected = [...selectedKeys];
            const cells = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            console.notify("Total shifted", [...cells].length);
            // cells.forEach(c => c.shift(dx, dy, dz));
            // We changed a property of the cell, but to update it on react,
            // we need to change the key
            // cells.forEach(c => newSelected.delete(c.key));
            // cells.forEach(c => newSelected.add(c.key));
            // this.selected_ = transferSelected(complex, newSelected);

            const stepData: CWComplexEditStep = {
                args: [dx, dy, dz],
                type: "shift",
                step: (c: CWComplex) => {
                    const cells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    cells.forEach(cell => cell.shift(dx, dy, dz));
                },
                selectedKeys: newSelected
            };

            const newComplex = new CWComplex();
            newComplex.assignFrom(complex);
            stepData.step(newComplex);
            return {
                ...editorState,
                history: [...history, stepData],
                complex: newComplex,
                selectedKeys: newSelected,
            };

        });
    }
    
}

export type EditorState = {
    history: CWComplexEditStep[];
    complex: CWComplex;
    selectedKeys: string[];
    lastSelect: LastSelect;
    meta: ComplexMeta;
    freezeIndex: number;
}
export const makeDefaultMeta = (): ComplexMeta => ({
    name: "New CW Complex",
    description: "A new CW complex",
    author: "User",
    date: new Date().toISOString(),
});
export const makeDefault = (): EditorState => {

    const defaultComplex = new CWComplex();
    const defaultHistory = [{
        type: "start" as EditType,
        step: () => {},
        selectedKeys: [],
        args: []
    }];
    const defaultMeta: ComplexMeta = makeDefaultMeta();

    return {
        lastSelect: {
            lastClickedDepth: -1,
            cellList: ""
        },
        history: defaultHistory,
        complex: defaultComplex,
        selectedKeys: [],
        meta: defaultMeta,
        freezeIndex: -1,
    };
}


export function useEditComplex(preset?: (e: CWComplexStateEditor) => void): [EditorState, CWComplexStateEditor] {
    
    const [editorState, setEditorState] = useState<EditorState>(makeDefault());
    const { history, complex, selectedKeys, meta } = editorState;

    // const setHistory = (history: CWComplexEditStep[]) => {
    //     // now the history is steps - functions that map a complex to a new complex
    //     setEditorState(data => ({ ...data, history }));
    // };
    
    // const [selected, setSelected] = useState<Set<AbstractCell>>(new Set());
    const editComplex = useMemo(
        () => {
            return new CWComplexStateEditor(setEditorState, editorState)
        },
        [editorState, history]
    );

    // if (preset) {
    //     // preset(editComplex);
    // }
    // const latest = complex;
    // return [{ history, complex, selectedKeys, meta }, editComplex];
    return [editorState, editComplex];
}
