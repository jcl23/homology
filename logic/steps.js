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
const keyToCellType = (key) => ["vertex", "edge", "face", "ball"][+key[0]];
const makeAddEdgeStep = () => ({
    type: "addEdge",
    step: (complex, selectedKeySet) => {
        const selectedKeys = [...selectedKeySet ?? []];
        //const reps = [...retrieveCellsFromSelectedKeys(complex, selectedKeys)];
        if (selectedKeys.length !== 2) {
            console.notify("EditFailure", `Cannot add edge with ${selectedKeys.length} representatives`);
        }
        if (!selectedKeys.every(rep => rep[0] == "0")) {
            const failingRep = selectedKeys.find(rep => rep[0] !== "0");
            if (!failingRep)
                throw new Error("No failing rep found??? Wtf");
            // complex.cellByKey(failingRep);
            console.notify("EditFailure", `Tried to add an edge using a ${keyToCellType(failingRep)} as a vertex`);
        }
        complex.addEdge(selectedKeys[0], selectedKeys[1]);
    },
    selectedKeys: new Set()
});
const makeAddFaceStep = () => ({
    type: "addFace",
    step: (complex, selectedKeySet) => {
        const selectedKeys = [...selectedKeySet ?? []];
        if (selectedKeys.length !== 3) {
            console.notify("EditFailure", `Cannot add face with ${selectedKeys.length} representatives`);
        }
        if (!selectedKeys.every(rep => rep[0] == "1")) {
            const failingRep = selectedKeys.find(rep => rep[0] !== "1");
            if (!failingRep)
                throw new Error("No failing rep found??? Wtf");
            console.notify("EditFailure", `Tried to add a face using a ${keyToCellType(failingRep)} as an edge`);
        }
        complex.addFace(selectedKeys[0], selectedKeys[1], selectedKeys[2]);
    },
    selectedKeys: new Set()
});
export { makeAddEdgeStep, makeAddFaceStep };
