import { add, all, min } from "three/webgpu";
import { createMatrix, LabeledMatrix, Matrix, NamedMatrix } from "./matrix";
import { getChainGroups } from "./homology";
import { AbstractBall, AbstractCell, AbstractEdge, AbstractFace, AbstractVertex, Ball, Cell, Edge, Face, Vertex } from "./classes/cells";
import { CWComplexEditStep } from "../logic/steps";
import {MAX_DIMENSION} from "../data/configuration";
import { reindexCheck } from "./reindexCheck";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";
export type Key = `${number} ${number}`;
export type ComplexMeta = {
    name: string;
    description?: string;
    author?: string;
    date?: string;
}

export type CellsType = AbstractCell[][];
//  & {
//     // 0: AbstractVertex[];
//     // 1: AbstractEdge[];
//     // 2: AbstractFace[];
//     // 3: AbstractBall[];
//     [key: number]: AbstractCell[];
// };

export class CWComplex {
    cells: CellsType;
    cellCounts: number[];
    constructor() {
        const from = { cells: [[] , [], [], [], []], cellCounts: [0, 0, 0, 0, 0] } as CWComplex;
        // create new
        this.cellCounts = [0, 0, 0, 0, 0];
        this.cells = [ ...from.cells ] as CellsType;
    }

    get numCells(): number {
        return this.cellCounts.reduce((acc, count) => acc + count, 0);
    }
    assignFrom(from: CWComplex) {
        this.cells = [ ...from.cells ];
    }

    getCellByVertices(names: string[]) {
        const dim = names.length - 1;
        const allCells = this.cells[dim];
        return allCells.find(cell => cell.name)
    }
    identifyEdges (cells: Set<AbstractCell>): void {
        identifyEdges(this, cells);
        this.cellCounts[1] = (this.cellCounts[1] || 0) - (cells.size - 1);
    }
    identifyEdgesByName (edgeNames: string[]): void {
        const edges = edgeNames.map(name => (getRepsByName(this, name, 1) as AbstractEdge[])[0]);
        const name = edgeNames.join("/");
        identifyEdges(this, new Set(edges), name);
    }
    identifyVertices (cells: Set<AbstractCell>): void  {
        identifyVertices(this, cells);
    }
    identifyCells (cells: Set<AbstractCell>, renameCells = true): void {
        identifyCells(this, cells, renameCells);
    }

    identifyNamedCells (cellNames: string[]): void {
        const cells = cellNames.map(name => getRepsByName(this, name)).flat();

        if (cells.length === 0) {
            throw new Error("No cells found with the given names");
        }

        const dimension = cells[0].dimension;
        if (!cells.every(cell => cell.dimension === dimension)) {
            throw new Error("Cannot identify cells of different dimensions");
        }
        this.identifyCells(new Set(cells), true);

        // if (dimension === 0) {
        //     this.identifyVertices(new Set(cells));
        // } else if (dimension === 1) {
        //     this.identifyEdges(new Set(cells));
        // } else {
        //     // For higher dimensions, just set all cells to the same index and name
        //     const rep = cells[0];
        //     cells.forEach(cell => {
        //         cell.index = rep.index;
        //         cell.name = rep.name;
        //     });
        //     this.cellCounts[dimension] = (this.cellCounts[dimension] || 0) - (cells.length - 1);
        //     this.reindex();
        // }
    }

    addVertex (position: [number, number, number], name?: string): Vertex {
        const uniqueCells = [...new Set(this.cells[0].map(c => c.index))];
        const vertex = new Vertex(position, this.cells[0].length, uniqueCells.length,  name);
        addCell(this, vertex);
        return vertex;
    }

    add(keys: string[], dim: number, name: (string | ((c?: Cell) => string))): Cell {
        let retVal: Cell;
        console.count("Adding cell")
        if (dim < 1 || dim > 3) throw new Error("Invalid dimension");
        if (dim === 1) {
            retVal =  this.addEdge(keys);
        } else if (dim === 2) {
            retVal = this.addFace(keys);
        } else {
            retVal = this.addBall(keys);
        }
        if (typeof name === "function") {
            retVal.name = name(retVal);
        } else {
            retVal.name = name;
        }
        return retVal;
    }
    deleteCell(cell: AbstractCell): void {
        deleteCell(this, cell);
    }

    createSubcomplex(cells: AbstractCell[]): CWComplex {
        const subcomplex = new CWComplex();
        const map = new Map<string, AbstractCell>();
        cells.forEach(cell => {
            const copy = cell.copy();
            map.set(cell.key, copy);
            subcomplex.cells[cell.dimension].push(copy);
            // subcomplex.cells[cell.dimension].push(cell.copy());
        });

        subcomplex.cells.forEach(dimCells => {
            dimCells.forEach(cell => {
                const attachingMap = cell.attachingMap.map(att => map.get(att.key));
                cell.attachingMap = attachingMap;
                const cob = cell.cob.map(cob => map.get(cob.key) ?? cob);
                cell.cob = cob;
            });
        })
        // reindex the subcomplex
        resetIndices(subcomplex);
        resetIds(subcomplex);
        return subcomplex;
    }

    join(complex: CWComplex) {
        // Join the cells of another complex to this one., update the ids.
        const copy = complex.copy();
        copy.cells.forEach((dimCells, dim) => {
            dimCells.forEach(cell => {    
                cell.id = this.cells[dim].length;
                this.cells[dim].push(cell);
                this.cellCounts[dim] = (this.cellCounts[dim] || 0) + 1;
            });
        });
    }
    addEdge (keys: string[], name?: string): Edge {
        if (keys.length !== 2) throw new Error("Must add edge with exactly two vertices");
        const vertices = [...retrieveCellsFromSelectedKeys(this, new Set(keys))] as AbstractVertex[];
        return addEdge(this, vertices, name);
    }

    addEdgeByNames (names: string[], edgeName?: string): Edge {
        const vertices = names.map(n => (getRepsByName(this, n, 0) as AbstractVertex[])[0]);
        return addEdge(this, vertices, edgeName);
    }

    addFace (edgeKeys: string[], name?: string): Face {
        const edges = [...retrieveCellsFromSelectedKeys(this, new Set(edgeKeys))] as AbstractEdge[];
        return addFace(this, edges, name);
    }

    addCellByVertices(cell: AbstractCell): void {
        addCell(this, cell);
    }

    addFaceByNames(edgeNames: string[], name?: string): Face {
        const edges =  edgeNames.map(name => getRepsByName(this, name, 1)).flat() as AbstractEdge[];
        return addFace(this, edges, name);
    }


    addBall (faceKeys: string[], name?: string): Ball {
        const faces = [...retrieveCellsFromSelectedKeys(this, new Set(faceKeys))] as AbstractFace[];
        return addBall(this, faces, name);
    }
    getRepsByKey(key: Key): AbstractCell[] {
        const [dimension, id_] = key.split(" ");
        const id = parseInt(id_);
        const cells = this.cells[parseInt(dimension)].filter(cell => cell.id == id);
        if (cells.length === 0) throw new Error(`Couldn't find cell with key ${key}`);
        return cells;
    }

    getRepsByName(name: string, dim?: number): AbstractCell[] {
        return getRepsByName(this, name, dim);
    }

    get size(): string {
        return "(" + [0, 1, 2, 3].map(dim => this.cells[dim].length).join(", ");
    }
    get numReps(): number {
        return this.cells[0].length + this.cells[1].length + this.cells[2].length + this.cells[3].length;
    }
    
        
    copy(): CWComplex {

        const newComplex = new CWComplex();
        const oldToNewMap = new Map<string, AbstractCell>();
        for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
            this.cells[dim].forEach(cell => {
                const newCell = cell.copy();
                oldToNewMap.set(`${dim} ${cell.id}`, newCell);
                newComplex.cells[dim].push(newCell);
            });
        }
        // for each dimension, for each cell in the dimension, get the current attaching map, and replace it with the new cells.
        for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
            newComplex.cells[dim].forEach(cell => {
                const newAttachingMap = cell.attachingMap.map(oldCell => {
                    return oldToNewMap.get(`${oldCell.dimension} ${oldCell.id}`)!;
                });
                cell.attachingMap = newAttachingMap;
            });
        }
        // for each dimension, for each cell in the dimension, get the current coboundary, and replace it with the new cells.
        for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
            newComplex.cells[dim].forEach(cell => {
                const newCob = cell.cob.map(oldCell => {
                    return oldToNewMap.get(`${oldCell.dimension} ${oldCell.id}`)!;
                });
                cell.cob = newCob;
            });
        }
        debugOldNewMap(oldToNewMap);
        return newComplex;
    }

    reindex(): void {
        resetIndices(this);
        resetIds(this);
    }

    get center(): [number, number, number] {
        if (this.cells[0].length === 0) return [0, 0, 0];
        const vertices = this.cells[0] as AbstractVertex[];
        const n = vertices.length;
        const [x, y, z] = [0, 1, 2].map(i => vertices.reduce((acc, v) => acc + v.point[i], 0) / n);
        return [x, y, z];
    }

}

const debugOldNewMap = function(m: Map<string, AbstractCell>) {
   let out = "OldNewMap Debug:\n"
    m.forEach((newCell, key) => {
        out += `${key} : ${newCell.key}\n`;;
    });
    console.notify("OldToNewMap", out);
}

const deleteCellFromBoundaries = (cell: AbstractCell): void => {
    cell.attachingMap.forEach(face => {
        face.cob = face.cob.filter(cob => cob !== cell);
    });
    cell.cob.forEach(cob => {
        cob.attachingMap = cob.attachingMap.filter(att => att !== cell);
    });
}

export const deleteAllCoboundaries = (complex: CWComplex, cell: AbstractCell): void => {
    const cob = cell.cob;
    cob.forEach(outer => {
        deleteCell(complex, outer);
    })
}
export const deleteCell = (complex: CWComplex, cell: AbstractCell): void => {
    deleteCellFromBoundaries(cell);
    deleteAllCoboundaries(complex, cell);
    complex.cells[cell.dimension] = complex.cells[cell.dimension].filter(c => c !== cell);
    complex.cellCounts[cell.dimension] = (complex.cellCounts[cell.dimension] || 0) - 1;
    resetIndices(complex);
    resetIds(complex);
}
export const retrieveCellsFromSelectedKeys = function(complex: CWComplex, selectedKeys?: Set<string>): Set<AbstractCell> {
    const selected = new Set<AbstractCell>();
    if (selectedKeys == null) return selected;
    selectedKeys.forEach(key => {
        const [dimension, id_] = key.split(" ");
        const id = parseInt(id_);
        const cell = complex.cells[parseInt(dimension)].find(cell => cell.id === id);
        if (!cell) {
            throw new Error(`Couldn't find cell with key ${key}`);
        }
        selected.add(cell);
    });
    return selected;
}

export const getRepsByName = function(complex: CWComplex, name: string, dim?: number): AbstractCell[] {
    const search = (dim: number) => {
        return complex.cells[dim].filter(cell => cell.name === name);
    };
    if (dim !== undefined) {
        const cell = search(dim);
        if (cell.length) return cell;
        throw new Error(`Couldn't find cell with name ${name}`);
    } else {
        return [0, 1, 2, 3].map(search).flat();
    }
}

// const getNewAttachingMap = (cell: AbstractCell, newFaces: AbstractCell[]): () => AbstractCell[] => {
//     // The cells in "newFaces" are copies of cells one dimension lower than cell. We want to replace the attaching map of cell with the equivalent in new faces.

//     const newAttachingMapData = cell.attachingMap.map(face => {
//         const newFace = newFaces.find(f => f.id === face.id);
//         if (!newFace) throw new Error("Couldn't find new face");
//         return newFace;
//     });
// }

export const getStartStep = (): CWComplexEditStep => ({
    step: () => new CWComplex(),
    selectedKeys: new Set(),
    type: "start"
});

export const copyStep = (step: CWComplexEditStep): CWComplexEditStep => {
    return { ... step };
}

// export class EditCWComplex {

//     history: CWComplexEditStep[];
//     private complex_: CWComplex;
//     selected: Set<string>;

//     constructor(start = getStartStep(), selected = new Set<string>()) {
//         this.history = [start];
//         this.complex_ = start.step(new Set());
//         this.selected = selected;
//     }

//     get complex(): CWComplex {
//         return this.complex.copy();
//     }
    
//     collapse(): void {
//         // identify all selected to a point 
//     }
    
//     saturate (vertices: AbstractVertex[], n: number): void { 
//         // const current = this.history[this.history.length - 1].complex;
//         // const newComplex = resetIndex(saturate(current, vertices, n));
//         // const nextStep: CWComplexEditStep = {
//         //     complex: newComplex,
//         //     type: "saturate"
//         // }
//         // this.history.push(nextStep);
//     }
//     setComplex (complex: CWComplex): void {
//         this.complex_ = complex.copy();
//         const nextStep: CWComplexEditStep = {
//             step: () => complex,
//             selectedKeys: new Set(),
//             type: "start"
//         }
//         this.history.push(nextStep);
//     }
//     addVertex (position: [number, number, number]): void {

//         //const current = this.history[this.history.length - 1].complex;
//         const step = (selected: Set<AbstractCell>, complex: CWComplex) => {
//             const newComplex = complex.copy();
//             newComplex.addVertex([...position]);
//             return newComplex;
//         }
//         const vertex = new Vertex(position, this.complex_.cells[0].length, this.complex_.cells[0].length);
//         const newComplex = addCell(this.complex_, vertex);
//         const nextStep: CWComplexEditStep = {
//             complex: newComplex,
//             type: "add"
//         }
//         this.history.push(nextStep);
//     }

//     addEdge (v1: AbstractVertex, v2: AbstractVertex): void {
//         const current = this.history[this.history.length - 1].complex;
//         const newComplex = addEdge(current, v1, v2);
//         const nextStep: CWComplexEditStep = {
//             complex: newComplex,
//             type: "add"
//         }
//         this.history.push(nextStep);
//     }

//     selectRep = (cell: AbstractCell): void => {
//         console.warn("select rep context", this);
//         this.selected.add(cell);
//     }

//     deselectRep = (cell: AbstractCell): void => {
//         this.selected.delete(cell);
//     }

//     deselectAll(): void {
//         this.selected = new Set();
//     }
    
//     toggleRepSelection = (cell: AbstractCell): void => {
//         if (this.selected.has(cell)) {
//             this.selected.delete(cell);
//         } else {
//             this.selected.add(cell);
//         }
//     }
// };


// signs and edges
type Chain = {
    sign: number;
    cell: AbstractCell;
}[];

export const getAnyCell = (complex: CWComplex, dimension: number, index: number): AbstractCell => {
    return complex.cells[dimension].find(cell => cell.index === index)!;
}

export const getCells = (complex: CWComplex, dimension: number, index: number): AbstractCell[] => {
    return complex.cells[dimension].filter(cell => cell.index === index)!;
}
export const getVertices = (c: AbstractCell): AbstractVertex[] => {
    // WARNING Will need to be replaced with something dynamic programming if i expand this to have higher dimensional cells cause its factorial time
    if (c.dimension === 0) return [c as AbstractVertex];
    return [...new Set(c.attachingMap.flatMap(getVertices))];
}
const sign = (cell: number[]) => {
    // if the least index is even, return 1, else return -1
    const numEven = cell.filter(i => i % 2 === 0).length;
    return numEven % 2 === 0 ? 1 : -1;
}

const printCell = (cell: AbstractCell): string  => {

    const { id, name, index, dimension } = cell;
    return `AbstractCell ${id} (${name}) of dimension ${dimension} with index ${index}\n`;
};
export const printCWComplex = (complex: CWComplex) => {
    let text = "";
    for (let dim = 0; dim <= 3; dim++) {
        // console.log(`Dimension ${dim}:`);
        for (const cell of complex.cells[dim]) {
            text += printCell(cell);
        }
    }
    console.log(text);
}

export const cellsAreEqual = (cell1: AbstractCell, cell2: AbstractCell): boolean => {
    if (cell1.dimension !== cell2.dimension || cell1.id !== cell2.id) return false;

    if (cell1.dimension === 0) {
        return (cell1 as AbstractVertex).point?.join(',') === (cell2 as AbstractVertex).point?.join(',');
    } else if (cell1.dimension === 1) {
        return (cell1 as AbstractEdge).attachingMap.toString() === (cell2 as AbstractEdge).attachingMap.toString();
    } else if (cell1.dimension === 2) {
        return (cell1 as AbstractFace).attachingMap.toString() === (cell2 as AbstractFace).attachingMap.toString();
    }

    return false;
};

export const printSelected = (complex: CWComplex, selectedCells: Set<AbstractCell>) => {
    console.log("Selected cells:");
    for (const cell of selectedCells) {
        printCell(cell);
    }
};

export const resetIndices = (complex: CWComplex): void => {
    // const newComplex = { ...complex };
    for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
        const allUsedIndicesSet = new Set<number>();
        complex.cells[dim].forEach((cell, i) => {
            allUsedIndicesSet.add(cell.index);
        });
        const allUsedIndices = Array.from(allUsedIndicesSet);
        allUsedIndices.sort((a, b) => a - b);
        const indexMap = allUsedIndices.reduce((acc, index, i) => {
            acc[index] = i;
            return acc;
        }, {} as Record<number, number>);
        complex.cells[dim].forEach(cell => {
            cell.index = indexMap[cell.index]; 
        });
    }
}

export const resetIds = (complex: CWComplex): void => {
    for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
        complex.cells[dim].forEach((cell, i) => {
            cell.id = i;
        });
    }
}
export const getBoundary = function (chain: Chain): Chain {
    // return a chain with the boundary of each cell summed up.
    const boundaryTracker: Map<string, { count: number, cell: AbstractCell }> = new Map();
    
    for (const { cell, sign: outerSign } of chain) {
       
        const boundary = (() => {
            try {
                return getBoundaryOfCell(cell)
            } catch (e) {
               
                console.error("Error getting boundary of cell", cell, e)    
                return getBoundaryOfCell(cell)
            }
        })();
        for (const { sign, cell } of boundary) {
            const signProduct = sign * outerSign;
            if (boundaryTracker.has(cell.key)) {
                const value = boundaryTracker.get(cell.key)!;
                const { count } = value;
                boundaryTracker.set(cell.key, { ...value, count: count + signProduct });

            } else {
                boundaryTracker.set(cell.key, { count: signProduct, cell });
            }
        }
    }
    return [...boundaryTracker.values()].map(({ count, cell }) => ({ sign: count, cell}));
    // combine like terms

}
export const isCycle = (complex: CWComplex, chain: Chain): boolean => {
    const boundary = getBoundary(complex, chain);
    const result =  printChain(boundary);
    return result == "0";
}

export const formsCycle = (complex: CWComplex, cells: AbstractCell[]): boolean => {
    const bigChain = cells.flatMap(cell => getBoundaryOfCell(cell));
    const result = printChain(getBoundary(bigChain));
    return result == "0";
}
// export const getBoundaryOfCell = (complex: CWComplex, dimension: number, index: number): Chain => {
// export const getBoundaryOfCell = (complex: CWComplex, dimension: number, index: number): Chain => {


type SubFace = { face: AbstractCell, missing: AbstractVertex };



export const getBoundaryFromParts = (faces: AbstractCell[]): Chain => {
    // model off of function below. don't edit in place, copy the array, then figure out the signs to make the chain
    // figure out the proper ordering first

    //     const cell = (
    //     d == 1 ? new Edge(allVerticesArray[0], allVerticesArray[1], -1, -1) :
    //     d == 2 ? new Face(faces as AbstractEdge[], -1, -1) :
    //     new Ball(faces as AbstractFace[], -1, -1)
    // );
        
    // const orient = cell.getLocalOrientation();
    // subFaces.sort((a, b) => orient[a.missing.id] - orient[b.missing.id]);
    const d = faces[0].dimension + 1;
    const cell = (
        d == 1 ? new Edge(faces[0].attachingMap[0] as AbstractVertex, faces[0].attachingMap[1] as AbstractVertex, -1, -1) :
        d == 2 ? new Face(faces as AbstractEdge[], -1, -1  ) :
        new Ball(faces as AbstractFace[], -1, -1)
    );
    return getBoundaryOfCell(cell);
    // const boundaryChain = upperChain.map
}


export const getBoundaryOfCell = (cell: AbstractCell, outerSign = 1): Chain => {
    if (cell.dimension === 0) {
        return [];
    }
    // const cell = getAnyCell(complex, dimension, index)
    // if (dimension === 1) {

    //     const [start, finish] = cell.attachingMap;
    //     return [{ sign: 1, dimension: 0, index: finish.index }, { sign: -1, dimension: 0, index: start.index }];
    // }

   const allVertices = cell.vertices;
    const allVerticesSet = new Set(allVertices);
    const allVerticesArray = Array.from(allVerticesSet);
    // allVerticesArray.sort((a, b) => a.id - b.id);
    const faces = cell.attachingMap;
    const subFaces: SubFace[] = faces.map(face => {
        const faceVertices = getVertices(face);
        const missing = allVerticesArray.find(vertex => !faceVertices.includes(vertex))!;
        return { face, missing };
    });
    const d = faces[0].dimension + 1;
    //     const cell = (
    //     d == 1 ? new Edge(allVerticesArray[0], allVerticesArray[1], -1, -1) :
    //     d == 2 ? new Face(faces as AbstractEdge[], -1, -1) :
    //     new Ball(faces as AbstractFace[], -1, -1)
    // );
        
    // const orient = cell.getLocalOrientation();
    // subFaces.sort((a, b) => orient[a.missing.id] - orient[b.missing.id]);
    if (cell.dimension == 1) {
        subFaces.sort((a, b) => a.missing.index - b.missing.index);
    } else if (cell.dimension == 2) {
        const hypotheticalFace = new Face(faces, -1, -1);
        const orient = hypotheticalFace.getLocalOrientation();
        subFaces.sort((a, b) => orient[b.missing.id] - orient[a.missing.id]);

    } else {
        const hypotheticalBall = new Ball(faces, -1, -1);
        const orient = hypotheticalBall.getLocalOrientation();
        subFaces.sort((a, b) => orient[a.missing.id] - orient[b.missing.id]);
    } 
    const boundaryChain: Chain = subFaces.flatMap(({ face, missing }, i) => {
        let sign = (i % 2 == 0) ? 1 : -1;
        sign *= outerSign;
        //return getBoundaryOfCell(face).map(({ cell: subFace, sign: sign2 }, j) => ({ sign: sign * sign2, cell: subFace }));
        return { sign, cell: face };
    });
    return simplifyChain(boundaryChain);

}


export const isValidVertexIdentification = (complex: CWComplex, vertices: AbstractVertex[]) => {
    // step 1: naive approach, check if the index of the vertices is contiguous
    const indices = vertices.map(v => v.index);
    const minIndex = Math.min(...indices);
    const maxIndex = Math.max(...indices);
    if (maxIndex - minIndex !== indices.length - 1) return false;

    // step 2: check if the vertices are in the complex
    const allVertices = complex.cells[0];
    return vertices.every(v => allVertices.includes(v));
}
type FiniteNumber = number & { _finiteBrand: never };

const isFiniteNumber = (value: number): value is FiniteNumber => {
    return Number.isFinite(value);
};
export const identifyVertices = (complex: CWComplex, cells: Set<AbstractCell>): void => {
    throw new Error("identifyVertices is deprecated, use identifyCells instead");
    const indices = Array.from(cells).map(c => c.index);
    const elements = complex.cells[0].filter(v => indices.includes(v.index));
    // select a representative vertex.Create a new complex in which all the vertices are identified with the representative vertex.
    // const elements = [...cells];
    if (elements.length === 0) return;
    let leastIndex = Infinity;
    let rep = null;
    for (let element of elements) {
        if (element.index < leastIndex) {
            leastIndex = element.index;
            rep = element;
        }
    }
    
    
    const repIndex = rep.index;
    const repName = rep.name;

    for (let i = 0; i < elements.length; i++) {
        const cell = elements[i];
        cell.index = repIndex;
        cell.name = repName;
    }
    complex.cellCounts[0] = (complex.cellCounts[0] || 0) - (elements.length - 1);
    // reindex the complex
    complex.reindex();
    // const representative = complex.cells[0].find(v => indices.has(v.index))!;
    // const index = representative.index;
    // const name = representative.name;
    // const allVertices = complex.cells[0];
    // allVertices.forEach(v => {
    //     if (indices.has(v.index)) {
    //         // change in place
    //         v.index = index;
    //         v.name = name;
    //     }
    // });

    // const newFaces = complex.cells[2].map(face => {
    //     const faceVertices = getVertices(face);
    //     if (vertices.some(v => faceVertices.includes(v))) {
    //         return { ...face, attachingMap: () => [representative, representative, representative] };
    //     }
    //     return face;
    // });
}
export const createPreset = (complex: CWComplex) => {

    const lines = [];
    const varNamePrefixes = ["v", "e", "f", "b"];
    const throwBoundaryError = `() => { throw new Error("Shouldn't compute boundary of vertex"); }`
    const varNames: string[][] = [[], [], [], []]
    for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
        for (let cell of complex.cells[dim]) {
            const boundaryMap = (dim === 0) ? throwBoundaryError : `() => [${cell.attachingMap.map(v => varNamePrefixes[dim - 1] + v.id).join(", ")}]`;
            const pointProp = (dim === 0) ? `, point: [${(cell as AbstractVertex).point.map(c => (~~(c * 100)) / 100).join(", ")}]` : "";
            const varName = `${varNamePrefixes[dim]}${cell.id}`;``
            const line = `const ${varName} = { id: ${cell.id}, name: "${cell.name}", dimension: ${cell.dimension}, index: ${cell.index}, attachingMap: ${boundaryMap}${pointProp}};`;
            varNames[dim].push(varName);
            lines.push(line);
        }
        lines.push("");
    }
    lines.push("return {");
    lines.push(`    cells: {`);
    for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
        lines.push(`        ${dim}: [${varNames[dim].join(", ")}],`);
    }
    lines.push(`    }`);
    lines.push(`};`);

    return lines.join("\n");
}

export const madeWithGivenVertices = (face: AbstractCell, vertices: AbstractVertex[]): boolean => {
    return face.vertices.every(v => vertices.includes(v));
    // return vertices.every(v => face.vertices.includes(v));
}

export const identifyEdges = (complex: CWComplex, cells: Set<AbstractCell>, newName?: string): void => {
    // const indices = Array.from(cells).map(c => c.index);
    const edges = complex.cells[1];
    if (edges.length === 0) return;
    let leastIndex = Infinity;
    let representative: AbstractCell | null = null;
    for (let cell of cells) {
        if (cell.attachingMap[0].index < leastIndex) {
            leastIndex = cell.index;
            representative = cell;
        }
    }
    // const representative = complex.cells[1].find(e => indices.some(index => index == e.index))!;
    // to be rewritten since its totally wrong

};

export const identifyCells = (complex: CWComplex, cells: Set<AbstractCell>, rename: boolean, newName?: string): void => {
    // a fully general algorithm. We need to ensure the delta complex structure is preserved.
    // when the order doesn't seem like it is preserved, until it is, identify needed vertices
    // const elements = [...cells];
    const cellArray = Array.from(cells);
    const d = cellArray[0].dimension;
    const indices = cellArray.map(c => c.index);
    const elements = complex.cells[d].filter(v => indices.includes(v.index));
    const numVertices = complex.cells[0].length;
    if (!elements.every(c => c.dimension === d)) {
        throw new Error("Cannot identify cells of different dimensions");
    } 
 
    const verticesBySubindex: AbstractVertex[][] = Array(d  + 1).fill(0).map(() => []);
    const minAtSubindex = Array(d + 1).fill(Infinity);
    const minCells = Array(d + 1).fill(null) as (AbstractCell | null)[];
    const maxAtSubindex = Array(d + 1).fill(-Infinity);
    const indexMap = Array(d).fill(0).map((_, i) => i); // begin as identity
    let representative: AbstractCell | null = null;
    elements.forEach(cell => {
        const vertices = cell.vertices;

        if (!representative) representative = cell;
        if (cell.vertices[0].index < representative.vertices[0].index) {
            representative = cell;
        }
        if (vertices.length !== d + 1) {
            throw new Error("Cannot identify non-simplicial cells");
        }
        vertices.forEach((v, i) => {
            verticesBySubindex[i].push(v);
            if (v.index < minAtSubindex[i]) {
                minAtSubindex[i] = v.index;
                minCells[i] = v;
            }
            if (v.index > maxAtSubindex[i]) {
                maxAtSubindex[i] = v.index;
            }
        });
    }); 

    for (let i = 0; i <= d; i++) {
        for (let j = i + 1; j <= d; j++) {
            if (maxAtSubindex[i] >= minAtSubindex[j]) {
                minAtSubindex[j] = minAtSubindex[i];
                minCells[j] = minCells[i];
                maxAtSubindex[i] = maxAtSubindex[j];
                indexMap[j] = i;
            }
        }
    }

    for (let i = 0; i <= d; i++) {
        const vertices = verticesBySubindex[i];
        if (vertices.length === 0) continue;
       
        // vertices.forEach(v => {
        //     v.index = minAtSubindex[i];
        //     if (rename) {
        //         v.name = minCells[i].name
        //         if (newName) v.name = newName;
        //     }
        // });
    }
    assignFromClosed(complex, representative!, elements, rename);
    complex.reindex();
    console.log("verticesBySubindex", verticesBySubindex);
}

const assignFrom = (complex: CWComplex, from: AbstractCell, to: AbstractCell[],  rename = true) => {
    to.forEach(t => {
        t.index = from.index;
        if (rename) t.name = from.name;
    });
}
const assignFromClosed = (complex: CWComplex,  from: AbstractCell, to: AbstractCell[], rename = true) => {
    assignFrom(complex, from, to, rename);
    const numFaces = from.attachingMap.length;
    for (let i = 0; i < numFaces; i ++) {
        const someFaces = to.map(t => t.attachingMap[i]);
        const indices = someFaces.map(c => c.index);
        const d = from.dimension - 1;
        const faces = complex.cells[d].filter(v => indices.includes(v.index));
        if (true || i % 2 == 0) {
            assignFromClosed(complex, from.attachingMap[i], faces, rename);
        } else {
            assignFrom(complex, from.attachingMap[i], faces, rename);
        }
    }
    // const face1s = to.map(t => t.attachingMap[0]);
    // const face2s = to.map(t => t.attachingMap[1]);
    // assignFrom(from.attachingMap[0], face1s);
    // assignFrom(from.attachingMap[1], face2s);
}


export const getCellsByLayer = (complex: CWComplex): AbstractCell[][] => {
    return [0, 1, 2, 3, 4].map(dim => {
        const allCells = complex.cells[dim];
        // return unique by index
        return allCells.filter((cell, i, arr) => arr.findIndex(c => c.index === cell.index) === i);
    });
}

export const simplifyChain = (chain: Chain): Chain => {
    // combine like terms
    const tracker: Map<string, number> = new Map();
    const cells: Map<string, AbstractCell> = new Map();
    if (!Array.isArray(chain)) {
        throw new Error("Chain is not an array");
    }
    for (const { sign, cell } of chain) {
        const key = cell.dimension + ", " + cell.index;
        cells.set(key, cell);
        if (tracker.has(key)) {
            const count = tracker.get(key)!;
            tracker.set(key, count + sign);
        } else {
            tracker.set(key, sign);
        }
    }
    return [...tracker.entries()].filter(([key, val]) => (val !== 0)).map(([key, sign]) => {
        const [dimension, index] = key.split(", ").map(Number);
        return { sign, cell: cells.get(key)! };
    });
}
export const printChain = (chain: Chain) => {
    const simplified = simplifyChain(chain);
    let retVal = simplified.reduce((acc, { sign, cell }) => {
        if (sign === 0) return acc;
        const coeffValue = Math.abs(sign) === 1 ? "" : Math.abs(sign);
        const orientationSymbol = sign > 0 ? "+ " : "- ";
        // const cell = getAnyCell(complex, dimension, index);
        return acc + " " + orientationSymbol + coeffValue + (cell?.name as any ?? "");
    }, "");
    if (retVal.length === 0) return "0";
    return retVal.slice(2);
}


const toLabeledMatrix = function(complex: CWComplex, cells: AbstractCell[]): LabeledMatrix {
    if (!reindexCheck(complex)) {
        throw new Error("Complex is not reindexed properly");
    }

    if (cells.length === 0 ) {
        return {
            matrix: [],
            outs: [],
            ins: []
        }
    }

    const targetDimension = cells[0].dimension - 1;
    //  height: The number of unique indices in all complex for the target dimension
    // width: the number of unique indices in the cells list.
    const dim = cells[0].dimension - 1;
    const allCells = [...complex.cells[dim]];
    allCells.sort((c1, c2) => c1.name.localeCompare(c2.name));
    // get all the boundaries, and find the max index.
    const ins = [...new Set(cells.map(cell => cell.index))];
    const width = ins.length;
    const outs = [...new Set(allCells.flatMap(cell => cell.index))];
    const height = outs.length;
    const outsInverse = Array(height).fill(0);
    outs.forEach((index, i) => {
        outsInverse[index] = i;
    });
    if (ins.some(i => i >= width)) {
        console.log({ins, width});
        throw new Error("Ins has indices greater than height");
    } 
    if (outs.some(i => i >= height)) {
        debugger;
        console.log({outs, height});
        throw new Error("Outs has indices greater than width");
    }
    
    console.log("Width", width, "Height", height);
    const matrix = createMatrix(height, width);
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const boundary = getBoundaryOfCell(cell);
        // for (let { index, sign } of boundary) {
        for (let j = 0; j < boundary.length; j++) {
            const { cell,  sign } = boundary[j];
            try {
                const row = outsInverse[cell.index];
                matrix[row][i] = sign;
            } catch (e) {
                console.log("Error", e);
            }
        }
    }
    // verifies that matrix is well formed
    matrix.forEach(function(row) {
        if (row.length !== width) {
            console.notify("matrixError", "Bad matrix:", matrix);
            console.log({complex, cells, ins, outs});
            const matrixString = matrix.map(row => row.join(" ")).join("\n");   
            throw new Error("Matrix is not well formed: \n " + matrixString);
        }
    });
    return {
        matrix,
        outs, ins
    }
}

const selectedToReps = function(complex: CWComplex, selectedCells: Set<number>[]): AbstractCell[][] {
    return selectedCells.map((selected, dim) => {
        return [...selected].flatMap(index => getCells(complex, dim, index));
    });
}
export const toLabeledMatrices = function(complex: CWComplex): LabeledMatrix[]  {
    const [vertices, ...cellsLists] = getCellsByLayer(complex);
    const matrices = cellsLists.map((cells, i) => {
        return toLabeledMatrix(complex, cells);

    });
    return matrices;
}

export const toNamedMatrix  = function(complex: CWComplex, cells: AbstractCell[]): NamedMatrix {
    const labeled = toLabeledMatrix(complex, cells);
    // get the names by ID.
    const ins = labeled.ins.map(index => {
        const cell = getCells(complex, cells[0].dimension, index)[0];
        return cell.name;
    });
    const outs = labeled.outs.map(index => {
        const cell = getCells(complex, cells[0].dimension - 1, index)[0];
        return cell.name;
    });
    return {
        matrix: labeled.matrix,
        ins, outs
    }
}

export const toNamedMatrices = function(complex: CWComplex): NamedMatrix[]  {
    const [vertices, ...cellsLists] = getCellsByLayer(complex);
    cellsLists.forEach((cells, i) => {
        cells.sort((c1, c2) => c1.name.localeCompare(c2.name));
    })
    const matrices = cellsLists.map((cells, i) => {
        return toNamedMatrix(complex, cells);

    });
    return matrices;
}

const addCell = function(complex: CWComplex, cell: AbstractCell): void {
    // const newComplex = { ...complex };
    // newComplex.cells[cell.dimension].push(cell);
    // return newComplex;
    // The above fails because the copying is shallow. We need to make a deep copy of the cells.

    complex.cells[cell.dimension].push(cell as any);
    complex.cellCounts[cell.dimension] = (complex.cellCounts[cell.dimension] || 0) + 1;
}

const addCellByVertices = function(complex: CWComplex, vertices: AbstractVertex[]): void {
    const cell = new Cell(complex.cells[2].length, complex.cells[2].length);
    // 1 vertex -> 0 dimension, 2 vertices -> 1 dimension, 3 vertices -> 2 dimension...
    const newCellDimension = vertices.length - 1;
    cell.dimension = newCellDimension;

    // need to get all the requisite faces from dimension one lower

    addCell(complex, cell);
}
// const updateCoboundaries = function(cell: AbstractCell) {
//     if (cell.dimension === 0) return;
// }
export const addEdge =  (complex: CWComplex, vertices: AbstractVertex[], name?: string): Edge => {
    // add the selected to the simplex
   
    const sortedVertices = vertices.sort((a, b) => b.index - a.index);
    const repIndex = complex.cells[1].length;

    // const cellCounts = getChainGroups(complex);
    let cellIndex;
    if (complex.cells[1].length > 0) {
        cellIndex = Math.max(...complex.cells[1].map(e => e.index)) + 1;
    } else {
        cellIndex = 0;
    }
    const edge = new Edge(sortedVertices[0], sortedVertices[1], cellIndex, repIndex, name);
    vertices[0].cob.push(edge);
    vertices[1].cob.push(edge);
    console.log("Adding edge", edge);
    complex.cells[1].push(edge);

    return edge;
}

export const addFace = (complex: CWComplex, edges: AbstractEdge[], name?: string): Face => {
    if (edges.some(e => e.dimension !== 1)) throw new Error("Must add face with exactly three edges");
    if (edges.length !== 3) {
        throw new Error("Must add face with exactly three edges");
    }
    const f = new Face(edges, complex.cells[2].length, complex.cells[2].length, name);
    if (formsCycle(complex, edges)) {
        complex.cells[2].push(f);
        edges.forEach(e => { e.cob.push(f); });
        return f;
    }
}

export const addBall = (complex: CWComplex, faces: AbstractFace[], name?: string): Ball => {
    const b = new Ball(faces, complex.cells[3].length, complex.cells[3].length, name);
    const isCycle = formsCycle(complex, faces);
    if (isCycle) {
        complex.cells[3].push(b);
        faces.forEach(f => { f.cob.push(b); })
    }
    return b;
}
// From a CWComplex and a list of vertices, fill in all cells between the vertices up to dimension n.
// Check if there is a cell present satisfying the condition first, if not, add it.
export const saturate = function(complex: CWComplex, vertices: AbstractVertex[], n: number): CWComplex {
    const newComplex = new CWComplex();
    const allVertices = new Set(vertices);
    for (let dim = 1; dim <= n; dim++) {
        const allCells = newComplex.cells[dim];
        const allCellsSet = new Set(allCells);
        const newCells = [];
        for (let cell of allCells) {
            if (dim === 1) {
                const [start, end] = cell.attachingMap;
                if (allVertices.has(start as AbstractVertex) && allVertices.has(end as AbstractVertex)) {
                    newCells.push(cell);
                }
            } else {
                const allVertices = getVertices(cell);
                if (allVertices.every(v => allVertices.includes(v as AbstractVertex))) {
                    newCells.push(cell);
                }
            }
        }
        newComplex.cells[dim] = newCells;
    }
    return newComplex;
}


const cellIsPresent = function(complex: CWComplex, cell: AbstractCell): boolean {
    return complex.cells[cell.dimension].some(c => cellsAreEqual(c, cell));
}

export const duplicate = function(complex: CWComplex, cell: AbstractCell): AbstractCell {
    // create a copy of the cell, and add it to the complex.
    const newCell = cell.copy();
    newCell.id = complex.cells[newCell.dimension].length;
    newCell.index = complex.cells[newCell.dimension].length;
    if (cellIsPresent(complex, newCell)) {
        throw new Error("Cell already present in complex");
    }
    addCell(complex, newCell);
    return newCell;
}

export const duplicateSelected = function(complex: CWComplex, selectedCells: Set<AbstractCell>): CWComplex {
    // create a new complex with the selected cells duplicated. ensure that the bounaries and coboundary sets are also duplicated and correctly point to the new cells.

    const newComplex = complex.copy();
   
}