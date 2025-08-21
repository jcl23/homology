import { CWComplexStateEditor, EditorState } from "../hooks/useCWComplexEditor";
import { CWComplexEditStep } from "../logic/steps";
import { CWComplex, getStartStep  } from "../math/CWComplex";


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

const angled = (a: number, r: number): [number, number, number] => {
    return [r * Math.cos(Math.PI * 2 * a), 0, r * Math.sin(Math.PI * 2 * a)];
}
export const Tetra: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ 
        name: "Sphere ($S^2 \\cong \\delta\\Delta^3$)",
        // description: "A sphere by the boundary of a tetrahedron ($\Delta^3$).",
    });
    editor.addVertex(angled(0,  2), "a");
    editor.addVertex(angled(1 / 3, 2), "b");
    editor.addVertex(angled(2 / 3, 2), "c");
    editor.addVertex([0, 8 / 3, 0], "d");
    editor.selectAll();
    editor.addCell();
    editor.addCell();

    editor.rename("acd", "B");
    editor.rename("bcd", "A");
    editor.rename("abd", "C");
    editor.rename("abc", "D");
    editor.deselectAll();

}
  
export const KleinBottle: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ name: "Klein Bottle ($K \\cong \\Delta^1 \\times \\Delta^1 / \\sim$)" });

    editor.addVertex([-2, 0, 0], "a");
    editor.addVertex([0, 0, -2], "b");
    editor.addVertex([2, 0, 0], "c");
    editor.addVertex([0, 0, 2], "d");
    editor.selectAll();
    editor.addCell();
    editor.addCell();
    editor.deselectAll();
    editor.selectRep("1 4");
    editor.deleteCells();
    editor.identifyNamedCells(["ab", "cd"]);
    editor.identifyNamedCells(["ad", "bc"]);
    editor.rename("ab", "f");
    editor.rename("ad", "g");
    editor.rename("ac", "h");
    editor.rename("acd", "A");
    editor.rename("abc", "B");
    editor.deselectAll();

    // editor.identify();
    // editor.deselectAll();
    // editor.selectRep("1 2");
    // editor.selectRep("1 4");
    // editor.identify();
    // editor.deselectAll();
    
}

export const RP2: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ name: "Real Projective Plane ($\\mathbb{RP}^2 \\cong \\Delta^1 \\times \\Delta^1 / \\sim$)" });
    editor.addVertex([-2, 0, 0], "a");
    editor.addVertex([2, 0, 0], "a_");
    editor.addVertex([0, 0, -2], "b");
    editor.addVertex([0, 0, 2], "b_");
    editor.selectAll();
    editor.addCell();
    editor.deselectAll();
    editor.selectRep("1 0");
    editor.deleteCells();
    editor.selectRep("1 4");
    editor.selectRep("0 0");
    editor.addCell();
    editor.deselectAll();
    editor.selectRep("1 4");
    editor.selectRep("0 1");
    editor.addCell();
    editor.deselectAll();
    editor.selectRep("1 0");
    editor.selectRep("1 3");
    editor.identify();
    editor.deselectAll();
    editor.selectRep("1 1");
    editor.selectRep("1 2");
    editor.identify();
    editor.deselectAll();
}

export const Sphere: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ name: "Sphere ($S^2 \\cong \\Delta^1 \\times \\Delta^1 / \\sim$)" });

    editor.addVertex([0, 0, -2], "a");
    editor.addVertex([-2, 0, 0], "b");
    editor.addVertex([2, 0, 0], "b_");
    editor.addVertex([0, 0, 2], "c");

    editor.selectAll();
    editor.addCell();
    editor.addCell();
    editor.deselectAll();
    editor.selectRep("1 3");
    editor.deleteCells();
    editor.selectRep("1 0");
    editor.selectRep("1 1");
    editor.identify();
    editor.deselectAll();
    editor.selectRep("1 3");
    editor.selectRep("1 4");
    editor.identify();  
    editor.deselectAll();
}

export const KleinBottle2: Preset = (editor: CWComplexStateEditor) => {
    editor.reset();
    Tetra(editor);
        editor.setMeta({ name: "Klein Bottle ($K= \\Delta^3/\\sim$)" });


    editor.deselectAll();
    editor.identifyNamedCells(["ab", "bd"]);
    editor.identifyNamedCells(["ac", "cd"]);
    editor.deselectAll();

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