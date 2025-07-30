import { useMemo, useState } from "react";
import { CWComplex, copyStep, getBoundary, getBoundaryOfCell, getVertices, madeWithGivenVertices, retrieveCellsFromSelectedKeys } from "../math/CWComplex";
import { AbstractCell, Cell, Edge,Vertex } from "../math/classes/cells";
import { CWComplexEditStep  } from "../logic/steps";
import { MAX_DIMENSION, MAX_VERTEX_SELECT} from "../data/configuration";
import { ThermostatOutlined } from "@mui/icons-material";

type CellIdentifier = {
    id: string; // all unique
    index: number; // a poset map from IDs
    name?: string; // a human readable name
}
type ComplexHistorySetter = React.Dispatch<React.SetStateAction<EditorState>>;
type SelectedSetter = React.Dispatch<Set<string>>;

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
const transferSelected = function(complex: CWComplex, selected: Set<string>): Set<AbstractCell> {
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



export class CWComplexStateEditor  {

    // private selected - update on every change
    private selected_: Set<AbstractCell> = new Set();

    constructor(
        // private history_: CWComplexEditStep[], 
        private setEditorState: ComplexHistorySetter,
        private history: CWComplexEditStep[]
    ) { 
        this.setComplex = this.setComplex.bind(this);
        this.performVertexIdentification = this.performVertexIdentification.bind(this);
        this.performEdgeIdentification = this.performEdgeIdentification.bind(this);
        this.toggleRepSelection = this.toggleRepSelection.bind(this);
        this.addVertex = this.addVertex.bind(this);
        this.collapse = this.collapse.bind(this);
        this.addCell = this.addCell.bind(this);
        this.identify = this.identify.bind(this);
        this.undo = this.undo.bind(this);
        this.reset = this.reset.bind(this);
    }
    
    // get complex(): CWComplex {
    //     return this.history_[this.history_.length - 1].complex;
    // }

    get selected(): Set<AbstractCell> {
        return new Set(this.selected_);
    }

    // get history(): CWComplexEditStep[] {
    //     return this.history_.map(copyStep);
    // }
    reset(): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            return {
                history: [{ 
                    type: "start", 
                    step: () => new CWComplex(), 
                    selectedKeys: new Set() 
                }], 
                complex: new CWComplex(),
                selectedKeys: new Set()
            };
    })};
    setComplex(newComplex: CWComplex): void {
        this.selected_ = new Set();
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
                
                const editStep: CWComplexEditStep = {
                    type: "start",
                    step: (complex: CWComplex) => {complex.assignFrom(newComplex)},
                    selectedKeys: new Set()
                };
                if (DEBUG) console.log("NewStep", editStep);
                editStep.step(complex, selectedKeys, );
                return {
                    history: [editStep],
                    complex: complex,
                    selectedKeys: selectedKeys
                };
            }
        );
    }
    identify(): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            if (selectedKeys.size === 0) {
                console.notify("Select some cells to identify");
                return { history, complex, selectedKeys };
            }
            
            const editStep: CWComplexEditStep = { 
                type: "identify",
                selectedKeys: new Set(selectedKeys),
                step: (c: CWComplex, selectedKeys?: Set<string>)  => { 
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    
                    const dimension = [...selectedCells][0].dimension;
                    if (dimension === 0) {
                        c.identifyVertices(selectedCells);
                    } else if (dimension === 1) {
                        c.identifyEdges(selectedCells);
                    } else if (dimension === 2) {
                       // c.identifyFaces(selectedCells);
                    } else {
                        throw new Error("Cannot identify balls");    
                    }
                }
            };
            if (DEBUG) console.log("NewStep", editStep);
            try {
                editStep.step(complex, selectedKeys);
            } catch (e) {
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
    performVertexIdentification(): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            // const selected = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            // complex.performVertexIdentification(selected);
            const editStep: CWComplexEditStep = { 
                type: "identifyVertices",
                selectedKeys: new Set(selectedKeys),
                step: (c: CWComplex, selectedKeys?: Set<string>) => { 
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    c?.identifyVertices(selectedCells) }
            };
            if (DEBUG) console.log("NewStep", editStep);
            
            editStep.step(complex, selectedKeys);
            return {
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys
            };
        });
    }

    performEdgeIdentification(): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            const selected = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            complex.identifyEdges(selected);
            const editStep: CWComplexEditStep = { 
                type: "identifyEdges",
                selectedKeys: new Set(selectedKeys),
                step: (c: CWComplex, selectedKeys?: Set<string>) => { 
                    const selectedCells = retrieveCellsFromSelectedKeys(c, selectedKeys);
                    c.identifyEdges(selectedCells);
                    c.reindex(); 
                }
            };
            if (DEBUG) console.log("NewStep", editStep);
            return {
                history: [...history, editStep],
                complex: complex,
                selectedKeys: selectedKeys
            };
        });
    }
    addVertex(position: [number, number, number], name?: string): void {
        console.count("addVertex");
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {

            // const complex = history[history.length - 1].complex;
            // const newComplex = complex.addVertex(position);
            const stepData: CWComplexEditStep = { 
                type: "addVertex", 
                step: (c: CWComplex) => { 
                    c.addVertex([...position], name); 
                },
                selectedKeys: new Set() 
            };
            stepData.step(complex);
            if (DEBUG) console.log("addVertex", complex.size);
            return {
                history: [...history, stepData],
                complex: complex,
                selectedKeys: new Set(selectedKeys)
            };
        });
    }
    collapse(): void {
        // TODO
        // this.setHistory_(history => [...history])
    }

    addCell() {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            const keyList = [...selectedKeys];
            // use coboundaries to check for shit
            const step = function(complex: CWComplex, selectedKeys?: Set<string>) {
                console.count("Performed add cell step")
                const allCellsList: AbstractCell[] = [...retrieveCellsFromSelectedKeys(complex, selectedKeys)];
          
                const allVertices = unique(allCellsList.flatMap(getVertices));
                // sort vertices by id
                allVertices.sort((a, b) => a.id - b.id);
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
                    const existingHigherCells = unique(lowerCells.flatMap(c => c.cob));

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
                    const higherCells = iterateChoice(allVertices, i + 2).map((chosen, j) => {
                        const higherCells = includedHigherCells.filter(f => f.vertices.every(v => chosen.includes(v)));
                        const hypotheticalSummary = chosen.map(c => c.id).join(", ");
                        const face = verticesListMap.get(hypotheticalSummary);
                        
                        if (face) {
                            return face;
                        } else {
                            addMore = false;
                            const lowerFaces = chosen.map((_, i) => {
                                const faceVertices = chosen.filter((_, j) => i !== j);
                                const faceSummary = faceVertices.map(v => v.id).join(", ");
                                return lowerCells.find(c => c.vertexSummary === faceSummary)!;
                            });
                            return complex.add(lowerFaces.map(f => f.key), i + 1);
                        }
                    });
                   
                    lowerCells = higherCells;
                }
            }
            
            const stepData: CWComplexEditStep = {
                step,
                type: "saturate",
                selectedKeys: new Set(selectedKeys),
            }
            
            if (step === null) {
                console
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
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            const step = function(complex: CWComplex, selectedKeys?: Set<string>) {
                const cells = retrieveCellsFromSelectedKeys(complex, selectedKeys);
                cells.forEach(c => complex.deleteCell(c));
            };
            const stepData: CWComplexEditStep = {
                step,
                type: "delete",
                selectedKeys,
            }
            step(complex, selectedKeys);
            return {
                history: [...history, stepData],
                complex: complex,
                selectedKeys: new Set()
            };
        });
    }
    
    
    selectRep = (key: string): void => {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            const newSelected = new Set(selectedKeys);
            newSelected.add(key);
            console.notify("Selecting", key);
            this.selected_ = transferSelected(complex, newSelected);

            return {
                history: history,
                complex: complex,
                selectedKeys: newSelected
            }
        });
    }

    deselectRep(cell: AbstractCell): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {

            const newSelected = new Set(selectedKeys);
            newSelected.delete(cell.key);
            this.selected_ = transferSelected(complex, newSelected);
            return {
                history: history,
                complex: complex,
                selectedKeys: newSelected
            }
        });
    }

    toggleRepSelection(key: string): void { 
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            const newSelected = new Set(selectedKeys);
            //const key = cell.key;
            if (newSelected.has(key)) {
                newSelected.delete(key);
            } else {
                newSelected.add(key);
            }
            this.selected_ = transferSelected(complex, newSelected);
            return {
                history: history,
                complex: complex,
                selectedKeys: newSelected
            }
        });
    }

    deselectAll(): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            return {
                history: history,
                complex: complex,
                selectedKeys: new Set()
            }
        });
    }

    selectAll(): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            return {
                history: history,
                complex: complex,
                selectedKeys: new Set(Array(MAX_DIMENSION).fill(0).map((_, i) => complex.cells[i].map(c => c.key)).flat())
            }
        });
    }

    get center(): [number, number, number] {
        return [0, 0, 0];
    }

    jumpToStep(i: number): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
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

    undo(): void {
        console.warn("UNDO");
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
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

    shiftSelection(dx: number, dy: number, dz: number): void {
        this.setEditorState(({history, selectedKeys, complex}: EditorState) => {
            const newSelected = new Set(selectedKeys);
            const cells = retrieveCellsFromSelectedKeys(complex, selectedKeys);
            console.notify("Total shifted", [...cells].length);
            // cells.forEach(c => c.shift(dx, dy, dz));
            // We changed a property of the cell, but to update it on react,
            // we need to change the key
            cells.forEach(c => newSelected.delete(c.key));
            cells.forEach(c => newSelected.add(c.key));
            this.selected_ = transferSelected(complex, newSelected);

            const stepData: CWComplexEditStep = {
                type: "shift",
                step: (c: CWComplex) => {
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
            }
        });
    }
    
}

export type EditorState = {
    history: CWComplexEditStep[];
    complex: CWComplex;
    selectedKeys: Set<string>;
}
export function useEditComplex(preset?: (e: CWComplexStateEditor) => void): [EditorState, CWComplexStateEditor] {

    const [complexData, setComplexData] = useState<EditorState>({ 
        history: [{ 
            type: "start", 
            step: () => new CWComplex(), 
            selectedKeys: new Set() 
        }], 
        complex: new CWComplex(),
        selectedKeys: new Set(),
    });
    const { history, complex, selectedKeys } = complexData;

    const setHistory = (history: CWComplexEditStep[]) => {
        // now the history is steps - functions that map a complex to a new complex
        setComplexData(data => ({ ...data, history }));
    };
    
    const [selected, setSelected] = useState<Set<AbstractCell>>(new Set());
    const editComplex = useMemo(
        () => new CWComplexStateEditor(setComplexData, history),
        [setSelected, history]
    );

    // if (preset) {
    //     // preset(editComplex);
    // }
    // const latest = complex;
    return [{ history, complex, selectedKeys }, editComplex];
}