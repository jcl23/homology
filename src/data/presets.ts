import { CWComplexStateEditor, EditorState } from "../hooks/useCWComplexEditor";
import { CWComplexEditStep } from "../logic/steps";
import { CWComplex, getStartStep  } from "../math/CWComplex";
import { KleinBottle, RP2, Sphere, Test1 } from "./defaultComplexes";


export type Preset = (editor: CWComplexStateEditor) => void;
// const defaultPreset: Preset = () => ({
//     history: [],
//     complex: new CWComplex,
//     selectedKeys: undefined,
//     lastSelect: {
//         lastClickedDepth: 0,
//         cellList: ""
//     },
//     meta: {
//         name: "New Complex",
//         description: "",
//         author: "",
//         date: ""
//     }
// });



// const T2: () => CWComplex = () => {
//     const v1 = { id: "v1", name: "v1", dimension: 0, index: 0, point: [0, 0, 0], attachingMap: [] };
//     const v2 = { id: "v2", name: "v2", dimension: 0, index: 1, point: [1, 0, 1], attachingMap: [] };
//     const v3 = { id: "v3", name: "v3", dimension: 0, index: 2, point: [1, 0, 0], attachingMap: [] };
//     const v4 = { id: "v4", name: "v4", dimension: 0, index: 3, point: [0, 0, 1], attachingMap: [] };
//     const e1 = { id: "e1", index: 0, dimension: 1, name: "e1", attachingMap: [v3, v1] };
//     const e2 = { id: "e2", index: 1, dimension: 1, name: "e2", attachingMap: [v3, v2] };
//     const e3 = { id: "e3", index: 2, dimension: 1, name: "e3", attachingMap: [v4, v1] };
//     const e4 = { id: "e4", index: 3, dimension: 1, name: "e4", attachingMap: [v4, v2] };
//     const e5 = { id: "e5", index: 4, dimension: 1, name: "e5", attachingMap: [v4, v3] };
//     const f1 = { id: "f1", index: 0, dimension: 2, name: "f1", attachingMap: [e1, e3, e5] };
//     const f2 = { id: "f2", index: 1, dimension: 2, name: "f2", attachingMap: [e2, e4, e5] };
//     return {
//         cells: {
//             0: [v1, v2, v3, v4],
//             1: [e1, e2, e3, e4, e5],
//             2: [f1, f2],
//             3: []
//         }
//     };
// }


// }


const Tetra: Preset = (editor: CWComplexStateEditor) => {
    editor.addVertex
    editor.addVertex([0, 0, 0], "a");
    editor.addVertex([1, 0, 0], "b");
    editor.addVertex([0, 1, 0], "c");s
    editor.addVertex([0, 0, 1], "d");
    editor.selectAll();
    editor.addCell();
    editor.addCell();
}
  
export const complexes = {
    // K: {
    //     name: "K",
    //     complex: K()
    // },
    // S2: {
    //     name: "Ball",
    //     complex: ball()
    // },

    // Test: {
    //     name: "RP2",
    //     complex: TestComplex()
    // },
    // {
    //     name: "RP2",
    //     complex: RP2()
    // },
    // {
    //     name: "Square",
    //     complex: square()
    // },
    Empty: () => {},
    Tetra: Tetra,
    // RP2: {
    //     name: "RP2",
    //     complex: RP2()
    // },
    // Test1: {
    //     name: "Test1",
    //     history: [getStartStep()]

    // },
// RP2_pre_quotient: {
    //     name: "RP2_pq",
    //     complex: RP2()
    // },
    // KleinBottle: {
    //     name: "Klein Bottle",
    //     complex: KleinBottle()
    // },
    // Sphere: {
    //     name: "Sphere",
    //     complex: Sphere()
    // },
    // CopyTest: {
    //     name: "Copy Test",
    //     complex: Sphere().copy()
    // }
    // {
    //     name: "Torus",
    //     complex: torus()
    // }
} as Record<string, Preset>;

export const defaultComplex = complexes.Empty;