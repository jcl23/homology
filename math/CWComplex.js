import { createMatrix } from "./matrix";
import { Ball, Cell, Edge, Face, Vertex } from "./classes/cells";
import { MAX_DIMENSION } from "../data/configuration";
export class CWComplex {
    constructor() {
        Object.defineProperty(this, "cells", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const from = { cells: { 0: [], 1: [], 2: [], 3: [] } };
        // create new
        this.cells = { ...from.cells };
    }
    assignFrom(from) {
        this.cells = { ...from.cells };
    }
    getCellByVertices(names) {
        const dim = names.length - 1;
        const allCells = this.cells[dim];
        return allCells.find(cell => cell.name);
    }
    identifyEdges(cells) {
        identifyEdges(this, cells);
    }
    identifyEdgesByName(edgeNames) {
        const edges = edgeNames.map(name => getRepsByName(this, name, 1)[0]);
        const name = edgeNames.join("/");
        identifyEdges(this, new Set(edges), name);
    }
    identifyVertices(cells) {
        identifyVertices(this, cells);
    }
    addVertex(position, name) {
        const uniqueCells = [...new Set(this.cells[0].map(c => c.index))];
        const vertex = new Vertex(position, this.cells[0].length, uniqueCells.length, name);
        addCell(this, vertex);
        return vertex;
    }
    add(keys, dim, name) {
        console.count("Adding cell");
        if (dim < 1 || dim > 3)
            throw new Error("Invalid dimension");
        if (dim === 1) {
            return this.addEdge(keys, name);
        }
        else if (dim === 2) {
            return this.addFace(keys, name);
        }
        return this.addBall(keys, name);
    }
    deleteCell(cell) {
        deleteCell(this, cell);
    }
    addEdge(keys, name) {
        if (keys.length !== 2)
            throw new Error("Must add edge with exactly two vertices");
        const vertices = [...retrieveCellsFromSelectedKeys(this, new Set(keys))];
        return addEdge(this, vertices, name);
    }
    addEdgeByNames(names, edgeName) {
        const vertices = names.map(n => getRepsByName(this, n, 0)[0]);
        return addEdge(this, vertices, edgeName);
    }
    addFace(edgeKeys, name) {
        const edges = [...retrieveCellsFromSelectedKeys(this, new Set(edgeKeys))];
        return addFace(this, edges, name);
    }
    addCellByVertices(cell) {
        addCell(this, cell);
    }
    addFaceByNames(edgeNames, name) {
        const edges = edgeNames.map(name => getRepsByName(this, name, 1))[0];
        return addFace(this, edges, name);
    }
    addBall(faceKeys, name) {
        const faces = [...retrieveCellsFromSelectedKeys(this, new Set(faceKeys))];
        return addBall(this, faces, name);
    }
    getRepsByKey(key) {
        const [dimension, id_] = key.split(" ");
        const id = parseInt(id_);
        const cells = this.cells[parseInt(dimension)].filter(cell => cell.id == id);
        if (cells.length === 0)
            throw new Error(`Couldn't find cell with key ${key}`);
        return cells;
    }
    getRepsByName(name, dim) {
        return getRepsByName(this, name, dim);
    }
    get size() {
        return "(" + [0, 1, 2, 3].map(dim => this.cells[dim].length).join(", ");
    }
    get numCells() {
        return this.cells[0].length + this.cells[1].length + this.cells[2].length + this.cells[3].length;
    }
    copy() {
        /*
       I dont even need this probably should remove cause distracting
        */
        const newComplex = new CWComplex();
        const oldToNewMap = new Map();
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
                    return oldToNewMap.get(`${oldCell.dimension} ${oldCell.id}`);
                });
                cell.attachingMap = () => newAttachingMap;
            });
        }
        // for each dimension, for each cell in the dimension, get the current coboundary, and replace it with the new cells.
        for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
            newComplex.cells[dim].forEach(cell => {
                const newCob = cell.cob.map(oldCell => {
                    return oldToNewMap.get(`${oldCell.dimension} ${oldCell.id}`);
                });
                cell.cob = newCob;
            });
        }
        debugOldNewMap(oldToNewMap);
        return newComplex;
    }
    get center() {
        if (this.cells[0].length === 0)
            return [0, 0, 0];
        const vertices = this.cells[0];
        const n = vertices.length;
        const [x, y, z] = [0, 1, 2].map(i => vertices.reduce((acc, v) => acc + v.point[i], 0) / n);
        return [x, y, z];
    }
}
const debugOldNewMap = function (m) {
    let out = "OldNewMap Debug:\n";
    m.forEach((newCell, key) => {
        out += `${key} : ${newCell.key}\n`;
        ;
    });
    console.notify("OldToNewMap", out);
};
const deleteCellFromBoundaries = (cell) => {
    cell.attachingMap.forEach(face => {
        face.cob = face.cob.filter(cob => cob !== cell);
    });
    cell.cob.forEach(cob => {
        cob.attachingMap = cob.attachingMap.filter(att => att !== cell);
    });
};
export const deleteCell = (complex, cell) => {
    deleteCellFromBoundaries(cell);
    complex.cells[cell.dimension] = complex.cells[cell.dimension].filter(c => c !== cell);
    resetIndices(complex);
    resetIds(complex);
};
export const retrieveCellsFromSelectedKeys = function (complex, selectedKeys) {
    const selected = new Set();
    if (selectedKeys == null)
        return selected;
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
};
export const getRepsByName = function (complex, name, dim) {
    const search = (dim) => {
        return complex.cells[dim].filter(cell => cell.name === name);
    };
    if (dim !== undefined) {
        const cell = search(dim);
        if (cell.length)
            return cell;
        throw new Error(`Couldn't find cell with name ${name}`);
    }
    else {
        return [0, 1, 2, 3].map(search).flat();
    }
};
const getNewAttachingMap = (cell, newFaces) => {
    // The cells in "newFaces" are copies of cells one dimension lower than cell. We want to replace the attaching map of cell with the equivalent in new faces.
    const newAttachingMapData = cell.attachingMap.map(face => {
        const newFace = newFaces.find(f => f.id === face.id);
        if (!newFace)
            throw new Error("Couldn't find new face");
        return newFace;
    });
};
export const getStartStep = () => ({
    step: () => new CWComplex(),
    selectedKeys: new Set(),
    type: "start"
});
export const copyStep = (step) => {
    return { ...step };
};
export const getAnyCell = (complex, dimension, index) => {
    return complex.cells[dimension].find(cell => cell.index === index);
};
export const getCells = (complex, dimension, index) => {
    return complex.cells[dimension].filter(cell => cell.index === index);
};
export const getVertices = (c) => {
    // WARNING Will need to be replaced with something dynamic programming if i expand this to have higher dimensional cells cause its factorial time
    if (c.dimension === 0)
        return [c];
    return [...new Set(c.attachingMap.flatMap(getVertices))];
};
const sign = (cell) => {
    // if the least index is even, return 1, else return -1
    const numEven = cell.filter(i => i % 2 === 0).length;
    return numEven % 2 === 0 ? 1 : -1;
};
const printCell = (cell) => {
    const { id, name, index, dimension } = cell;
    return `AbstractCell ${id} (${name}) of dimension ${dimension} with index ${index}\n`;
};
export const printCWComplex = (complex) => {
    let text = "";
    for (let dim = 0; dim <= 3; dim++) {
        // console.log(`Dimension ${dim}:`);
        for (const cell of complex.cells[dim]) {
            text += printCell(cell);
        }
    }
    console.log(text);
};
export const cellsAreEqual = (cell1, cell2) => {
    if (cell1.dimension !== cell2.dimension || cell1.id !== cell2.id)
        return false;
    if (cell1.dimension === 0) {
        return cell1.point?.join(',') === cell2.point?.join(',');
    }
    else if (cell1.dimension === 1) {
        return cell1.attachingMap.toString() === cell2.attachingMap.toString();
    }
    else if (cell1.dimension === 2) {
        return cell1.attachingMap.toString() === cell2.attachingMap.toString();
    }
    return false;
};
export const printSelected = (complex, selectedCells) => {
    console.log("Selected cells:");
    for (const cell of selectedCells) {
        printCell(cell);
    }
};
export const resetIndices = (complex) => {
    // const newComplex = { ...complex };
    for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
        const allUsedIndicesSet = new Set();
        complex.cells[dim].forEach((cell, i) => {
            allUsedIndicesSet.add(cell.index);
        });
        const allUsedIndices = Array.from(allUsedIndicesSet);
        allUsedIndices.sort((a, b) => a - b);
        const indexMap = allUsedIndices.reduce((acc, index, i) => {
            acc[index] = i;
            return acc;
        }, {});
        complex.cells[dim].forEach(cell => {
            cell.index = indexMap[cell.index];
        });
    }
};
export const resetIds = (complex) => {
    for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
        complex.cells[dim].forEach((cell, i) => {
            cell.id = i;
        });
    }
};
export const getBoundary = function (complex, chain) {
    // return a chain with the boundary of each cell summed up.
    const boundaryTracker = new Map();
    for (const { index, dimension, sign: outerSign } of chain) {
        const cell = getAnyCell(complex, dimension, index);
        const boundary = getBoundaryOfCell(cell);
        for (const { sign, dimension, index } of boundary) {
            const signProduct = sign * outerSign;
            const key = dimension + ", " + index;
            if (boundaryTracker.has(key)) {
                const value = boundaryTracker.get(key);
                const { count } = value;
                boundaryTracker.set(key, { ...value, count: count + signProduct });
            }
            else {
                boundaryTracker.set(key, { count: signProduct, dim: dimension, index: index });
            }
        }
    }
    return [...boundaryTracker.values()].map(({ count, dim, index }) => ({ sign: count, dimension: dim, index: index }));
    // combine like terms
};
export const isCycle = (complex, chain) => {
    const boundary = getBoundary(complex, chain);
    const result = printChain(complex, boundary);
    return result == "0";
};
export const formsCycle = (complex, cells) => {
    return printChain(complex, getBoundaryFromParts(cells)) === "0";
};
export const getBoundaryFromParts = (faces) => {
    // model off of function below. don't edit in place, copy the array, then figure out the signs to make the chain
    // figure out the proper ordering first
    const allVertices = faces.flatMap(face => getVertices(face));
    const allVerticesSet = new Set(allVertices);
    const allVerticesArray = Array.from(allVerticesSet);
    allVerticesArray.sort((a, b) => a.id - b.id);
    const subFaces = faces.map(face => {
        const faceVertices = getVertices(face);
        const missing = allVerticesArray.find(vertex => !faceVertices.includes(vertex));
        return { face, missing };
    });
    subFaces.sort((a, b) => a.missing.id - b.missing.id);
    const boundaryChain = subFaces.flatMap(({ face, missing }, i) => {
        const sign = (i % 2 == 0) ? 1 : -1;
        return getBoundaryOfCell(face).map(({ dimension, index }, j) => ({ sign: sign * ((j % 2 == 0) ? 1 : -1), dimension, index }));
        return { sign, index: face.index, dimension: face.dimension };
    });
    return boundaryChain;
    // const boundaryChain = upperChain.map
};
export const getBoundaryOfCell = (cell) => {
    if (cell.dimension === 0) {
        return [];
    }
    // const cell = getAnyCell(complex, dimension, index)
    // if (dimension === 1) {
    //     const [start, finish] = cell.attachingMap;
    //     return [{ sign: 1, dimension: 0, index: finish.index }, { sign: -1, dimension: 0, index: start.index }];
    // }
    const allVertices = getVertices(cell);
    allVertices.sort((a, b) => a.id - b.id);
    // const inverseMap = allVertices.reduce((acc, vertex, index) => {
    //     acc[vertex.index] = index;
    //     return acc;
    // }, {} as Record<number, number>);
    // for each face, figure out which vertex is not there.
    const subFaces = cell.attachingMap.map((face) => {
        const faceVertices = getVertices(face);
        const missing = allVertices.find(vertex => !faceVertices.includes(vertex));
        return { face, missing };
    });
    subFaces.sort((a, b) => a.missing.id - b.missing.id);
    // for each subface, figure out the sign
    const boundary = subFaces.map(({ face, missing }, i) => {
        const sign = (i % 2 == 0) ? 1 : -1;
        return { sign, index: face.index, dimension: face.dimension };
    });
    return boundary;
};
export const isValidVertexIdentification = (complex, vertices) => {
    // step 1: naive approach, check if the index of the vertices is contiguous
    const indices = vertices.map(v => v.index);
    const minIndex = Math.min(...indices);
    const maxIndex = Math.max(...indices);
    if (maxIndex - minIndex !== indices.length - 1)
        return false;
    // step 2: check if the vertices are in the complex
    const allVertices = complex.cells[0];
    return vertices.every(v => allVertices.includes(v));
};
export const identifyVertices = (complex, cells) => {
    // select a representative vertex.Create a new complex in which all the vertices are identified with the representative vertex.
    const elements = [...cells];
    if (elements.length === 0)
        return;
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
    for (let i = 1; i < elements.length; i++) {
        const cell = elements[i];
        cell.index = repIndex;
        cell.name = repName;
    }
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
};
export const createPreset = (complex) => {
    const lines = [];
    const varNamePrefixes = ["v", "e", "f", "b"];
    const throwBoundaryError = `() => { throw new Error("Shouldn't compute boundary of vertex"); }`;
    const varNames = [[], [], [], []];
    for (let dim = 0; dim <= MAX_DIMENSION; dim++) {
        for (let cell of complex.cells[dim]) {
            const boundaryMap = (dim === 0) ? throwBoundaryError : `() => [${cell.attachingMap.map(v => varNamePrefixes[dim - 1] + v.id).join(", ")}]`;
            const pointProp = (dim === 0) ? `, point: [${cell.point.map(c => (~~(c * 100)) / 100).join(", ")}]` : "";
            const varName = `${varNamePrefixes[dim]}${cell.id}`;
            ``;
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
};
export const madeWithGivenVertices = (face, vertices) => {
    return face.vertices.every(v => vertices.includes(v));
    // return vertices.every(v => face.vertices.includes(v));
};
export const identifyEdges = (complex, cells, newName) => {
    const indices = Array.from(cells).map(c => c.index);
    const representative = complex.cells[1].find(e => indices.some(index => index == e.index));
    const [startIndex, endIndex] = representative.attachingMap.map(v => v.index);
    // check for starts all the same. If not, identify starts.
    const allBounds = indices.map(index => {
        const edge = complex.cells[1].find(e => e.index === index);
        return edge.attachingMap.map(v => v);
    });
    console.log("IDENTIFY");
    const allStarts = allBounds.map(([start, end]) => start);
    const allEnds = allBounds.map(([start, end]) => end);
    const maxStartIndex = Math.max(...allStarts.map(v => v.index));
    const minStartIndex = Math.min(...allStarts.map(v => v.index));
    const maxEndIndex = Math.max(...allEnds.map(v => v.index));
    const minEndIndex = Math.min(...allEnds.map(v => v.index));
    if (minStartIndex <= maxEndIndex) {
        // identify all from range maxStart to minEndIndex
        const vertices = complex.cells[0].filter(v => v.index <= maxStartIndex && v.index >= minEndIndex);
        identifyVertices(complex, new Set(vertices));
    }
    else {
        // they are separate, identify from maxStart to minStart and also maxEnd to minEnd.
        const set1 = complex.cells[0].filter(v => v.index <= maxStartIndex && v.index >= minStartIndex);
        const set2 = complex.cells[0].filter(v => v.index <= maxEndIndex && v.index >= minEndIndex);
        identifyVertices(complex, new Set(set1));
        identifyVertices(complex, new Set(set2));
    }
    // if (!allEnds.every(end => end.index === endIndex)) {
    //     identifyVertices(complex, new Set(allEnds));
    // }
    // if (!allStarts.every(start => start.index === startIndex)) {
    //     identifyVertices(complex, new Set(allStarts));
    // }
    const { id, name: name_, index } = representative;
    const name = newName ?? name_;
    const allEdges = complex.cells[1];
    allEdges.forEach(e => {
        if (indices.some(index => index == e.index)) {
            e.index = index;
            e.name = name;
        }
    });
    complex.reindex();
};
export const getCellsByLayer = (complex) => {
    return [0, 1, 2, 3].map(dim => {
        const allCells = complex.cells[dim];
        // return unique by index
        return allCells.filter((cell, i, arr) => arr.findIndex(c => c.index === cell.index) === i);
    });
};
export const simplifyChain = (complex, chain) => {
    // combine like terms
    const tracker = new Map();
    for (const { sign, dimension, index } of chain) {
        const key = dimension + ", " + index;
        if (tracker.has(key)) {
            const count = tracker.get(key);
            tracker.set(key, count + sign);
        }
        else {
            tracker.set(key, sign);
        }
    }
    return [...tracker.entries()].filter(([key, val]) => (val !== 0)).map(([key, sign]) => {
        const [dimension, index] = key.split(", ").map(Number);
        return { sign, dimension: dimension, index };
    });
};
export const printChain = (complex, chain) => {
    const simplified = simplifyChain(complex, chain);
    let retVal = simplified.reduce((acc, { sign, index, dimension }) => {
        if (sign === 0)
            return acc;
        const coeffValue = Math.abs(sign) === 1 ? "" : Math.abs(sign);
        const orientationSymbol = sign > 0 ? "+ " : "- ";
        const cell = getAnyCell(complex, dimension, index);
        return acc + " " + orientationSymbol + coeffValue + (cell?.name ?? "");
    }, "");
    if (retVal.length === 0)
        return "0";
    return retVal.slice(2);
};
const toLabeledMatrix = function (complex, cells) {
    if (cells.length === 0) {
        return {
            matrix: [],
            outs: [],
            ins: []
        };
    }
    const targetDimension = cells[0].dimension - 1;
    //  height: The number of unique indices in all complex for the target dimension
    // width: the number of unique indices in the cells list.
    const dim = cells[0].dimension - 1;
    const allCells = complex.cells[dim];
    // get all the boundaries, and find the max index.
    const ins = [...new Set(cells.flatMap(cell => cell.index))];
    const width = ins.length;
    const outs = [...new Set(allCells.flatMap(cell => cell.index))];
    const height = outs.length;
    if (ins.some(i => i >= width)) {
        console.log({ ins, width });
        throw new Error("Ins has indices greater than height");
    }
    if (outs.some(i => i >= height)) {
        console.log({ outs, height });
        throw new Error("Outs has indices greater than width");
    }
    console.log("Width", width, "Height", height);
    const matrix = createMatrix(height, width);
    for (let cell of cells) {
        const boundary = getBoundary(complex, [{ dimension: cell.dimension, index: cell.index, sign: 1 }]);
        for (let { index, sign } of boundary) {
            try {
                matrix[index][cell.index] = sign;
            }
            catch (e) {
                console.log("Error", e);
            }
        }
    }
    // verifies that matrix is well formed
    matrix.forEach(function (row) {
        if (row.length !== width) {
            console.notify("matrixError", "Bad matrix:", matrix);
            console.log({ complex, cells, ins, outs });
            const matrixString = matrix.map(row => row.join(" ")).join("\n");
            throw new Error("Matrix is not well formed: \n " + matrixString);
        }
    });
    return {
        matrix,
        outs, ins
    };
};
const selectedToReps = function (complex, selectedCells) {
    return selectedCells.map((selected, dim) => {
        return [...selected].flatMap(index => getCells(complex, dim, index));
    });
};
export const toLabeledMatrices = function (complex) {
    const [vertices, ...cellsLists] = getCellsByLayer(complex);
    const matrices = cellsLists.map((cells, i) => {
        return toLabeledMatrix(complex, cells);
    });
    return matrices;
};
const addCell = function (complex, cell) {
    // const newComplex = { ...complex };
    // newComplex.cells[cell.dimension].push(cell);
    // return newComplex;
    // The above fails because the copying is shallow. We need to make a deep copy of the cells.
    complex.cells[cell.dimension].push(cell);
};
const addCellByVertices = function (complex, vertices) {
    const cell = new Cell(complex.cells[2].length, complex.cells[2].length);
    // 1 vertex -> 0 dimension, 2 vertices -> 1 dimension, 3 vertices -> 2 dimension...
    const newCellDimension = vertices.length - 1;
    cell.dimension = newCellDimension;
    // need to get all the requisite faces from dimension one lower
    addCell(complex, cell);
};
// const updateCoboundaries = function(cell: AbstractCell) {
//     if (cell.dimension === 0) return;
// }
export const addEdge = (complex, vertices, name) => {
    // add the selected to the simplex
    const sortedVertices = vertices.sort((a, b) => b.index - a.index);
    const repIndex = complex.cells[1].length;
    // const cellCounts = getChainGroups(complex);
    let cellIndex;
    if (complex.cells[1].length > 0) {
        cellIndex = Math.max(...complex.cells[1].map(e => e.index)) + 1;
    }
    else {
        cellIndex = 0;
    }
    const edge = new Edge(sortedVertices[0], sortedVertices[1], cellIndex, repIndex, name);
    vertices[0].cob.push(edge);
    vertices[1].cob.push(edge);
    console.log("Adding edge", edge);
    complex.cells[1].push(edge);
    return edge;
};
export const addFace = (complex, edges, name) => {
    if (edges.some(e => e.dimension !== 1))
        throw new Error("Must add face with exactly three edges");
    if (edges.length !== 3)
        throw new Error("Must add face with exactly three edges");
    const f = new Face(edges, complex.cells[2].length, complex.cells[2].length, name);
    if (formsCycle(complex, edges)) {
        complex.cells[2].push(f);
        edges.forEach(e => { e.cob.push(f); });
    }
    return f;
};
export const addBall = (complex, faces, name) => {
    const b = new Ball(faces, complex.cells[3].length, complex.cells[3].length, name);
    if (isCycle(complex, [...faces].map(f => ({ sign: 1, index: f.index, dimension: 2 })))) {
        complex.cells[3].push(b);
    }
    return b;
};
// From a CWComplex and a list of vertices, fill in all cells between the vertices up to dimension n.
// Check if there is a cell present satisfying the condition first, if not, add it.
export const saturate = function (complex, vertices, n) {
    const newComplex = new CWComplex();
    const allVertices = new Set(vertices);
    for (let dim = 1; dim <= n; dim++) {
        const allCells = newComplex.cells[dim];
        const allCellsSet = new Set(allCells);
        const newCells = [];
        for (let cell of allCells) {
            if (dim === 1) {
                const [start, end] = cell.attachingMap;
                if (allVertices.has(start) && allVertices.has(end)) {
                    newCells.push(cell);
                }
            }
            else {
                const allVertices = getVertices(cell);
                if (allVertices.every(v => allVertices.includes(v))) {
                    newCells.push(cell);
                }
            }
        }
        newComplex.cells[dim] = newCells;
    }
    return newComplex;
};
const cellIsPresent = function (complex, cell) {
    return complex.cells[cell.dimension].some(c => cellsAreEqual(c, cell));
};
