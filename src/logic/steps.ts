import { select } from "material-components-web";
import { CWComplex, retrieveCellsFromSelectedKeys } from "../math/CWComplex";


export type AddingType = "addVertex" | "addEdge" | "addFace" | "addBall";
export type IdentifyType = "identify" | "identifyVertices" | "identifyEdges" | "identifyFaces" | "identifyBalls";
export type EditType = "delete" | AddingType | IdentifyType | "collapse" | "saturate" | "start" | "shift";

export type EditStep = (complex: CWComplex, selectedKeys?: Set<string>) => void;

export type CWComplexEditStep = {
    args: any[];
    step: EditStep;
    selectedKeys: Set<string>;
    type: EditType;
}

// previous:
// const stepData: CWComplexEditStep = { 
//     type: "addEdge", 
//     step: (_: Set<string>, c: CWComplex) => { 
//         c.addEdge(reps[0] as Vertex, reps[1] as Vertex) 
//         console.warn("Adding edge between", reps[0].id, reps[1].id);
//     },
//     selectedKeys: new Set(selectedKeys) 
// };

// stepData.step(selectedKeys, complex);
// if (DEBUG) console.log("addEdge", complex.size);
// return {
//     history: [...history, stepData],
//     complex: complex,
//     selectedKeys: new Set(selectedKeys)
// };

const keyToCellType = (key: string): string => ["vertex", "edge", "face", "ball"][+key[0]];
// const makeAddEdgeStep = (): CWComplexEditStep => ({
//     type: "addEdge",
//     step: (complex: CWComplex, selectedKeySet?: Set<string>) => {
//         const selectedKeys = [...selectedKeySet ?? []];
//         //const reps = [...retrieveCellsFromSelectedKeys(complex, selectedKeys)];
//         if (selectedKeys.length !== 2) {
//             console.notify("EditFailure", `Cannot add edge with ${selectedKeys.length} representatives`);
//         } 
//         if (!selectedKeys.every(rep => rep[0] == "0")) {
//             const failingRep = selectedKeys.find(rep => rep[0] !== "0");
//             if (!failingRep) throw new Error("No failing rep found??? Wtf");
//             // complex.cellByKey(failingRep);
//             console.notify("EditFailure", `Tried to add an edge using a ${keyToCellType(failingRep)} as a vertex`);
//         }

//         complex.addEdge(selectedKeys[0], selectedKeys[1]);
//     },
//     selectedKeys: new Set()
// });

// const makeAddFaceStep = (): CWComplexEditStep => ({
//     type: "addFace",
//     step: (complex: CWComplex, selectedKeySet?: Set<string>) => {
//         const selectedKeys = [...selectedKeySet ?? []];
//         if (selectedKeys.length !== 3) {
//             console.notify("EditFailure", `Cannot add face with ${selectedKeys.length} representatives`);
//         } 
//         if (!selectedKeys.every(rep => rep[0] == "1")) {
//             const failingRep = selectedKeys.find(rep => rep[0] !== "1");
//             if (!failingRep) throw new Error("No failing rep found??? Wtf");
//             console.notify("EditFailure", `Tried to add a face using a ${keyToCellType(failingRep)} as an edge`);
//         }

//         complex.addFace(selectedKeys[0], selectedKeys[1], selectedKeys[2]);
//     },
//     selectedKeys: new Set()
// });

// export {
//     makeAddEdgeStep, makeAddFaceStep
// }