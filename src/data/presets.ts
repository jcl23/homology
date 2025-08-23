import { texToUnicode } from "../comps/board/Label";
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
    editor.setMeta({ name: "Klein Bottle ($K \\cong \\Delta^1 \\times \\Delta^1 / \\sim$)", description: "Hatcher 2.1.5"  });
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
    editor.addVertex([2, 0, 0], "b");
    editor.addVertex([0, 0, -2], "c");
    editor.addVertex([0, 0, 2], "d");
    editor.selectAll();
    editor.addCell();
    editor.addCell();
    editor.deselectAll();
    editor.selectRep("1 0");
    editor.deleteCells();
    editor.identifyNamedCells(["ad", "bc"]);
    editor.identifyNamedCells(["ac", "bd"]);
    editor.rename("ad", "f");
    editor.rename("ac", "g");
    editor.rename("cd", "h");
    editor.rename("acd", "A");
    editor.rename("bcd", "B");

}

export const Sphere: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ name: "Sphere ($S^2 \\cong \\Delta^1 \\times \\Delta^1 / \\sim$)" });

    editor.addVertex([0, 0, -2], "a");
    editor.addVertex([-2, 0, 0], "b");
    editor.addVertex([2, 0, 0], "d");
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
    editor.rename("abc", "A");
    editor.rename("adc", "B");
    
}

export const KleinBottle2: Preset = (editor: CWComplexStateEditor) => {
    editor.reset();
    Tetra(editor);
        editor.setMeta({ name: "Klein Bottle ($K= \\Delta^3/\\sim$)" , 
        description: "Hatcher 2.1.2" 
        });


    editor.deselectAll();
    editor.identifyNamedCells(["ab", "bd"]);
    editor.identifyNamedCells(["ac", "cd"]);
    editor.deselectAll();

}

export const TriangleParachute: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ name: "Triangle Parachute", description: "Hatcher 2.1.4" });
    editor.addVertex(angled(0, 2), "a");
    editor.addVertex(angled(1 / 3, 2), "b");
    editor.addVertex(angled(2 / 3, 2), "c");
    editor.selectAll();
    editor.addCell();
    editor.addCell();
    editor.identify();

}

export const H216: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ name: "Hatcher 2.1.6 (n=3)", description: "Hatcher 2.1.6" });
    const c = 4;
    const w = 2; 
    const h = c / w;
    for (let i = 0; i < c; i++) {
        const sx = (i % w) * 2 - w + 1;
        const sy = Math.floor(i / w) * 2 - h + 1;
        editor.addVertex([sx, 0, sy], `${i}0`);
        editor.addVertex([sx, 0, sy + 1], `${i}1`);
        editor.addVertex([sx + 1, 0, sy + 1], `${i}2`);
        editor.selectRep(`0 ${i*3}, 0 ${i*3+1}, 0 ${i*3+2}`);
        editor.addCell();
        editor.addCell();
        editor.rename(`${i}0${i}1`, `${i}|01`);
        editor.rename(`${i}0${i}2`, `${i}|02`);
        editor.rename(`${i}1${i}2`, `${i}|12`);
        editor.rename(`${i}0${i}1${i}2`, `A${i}`);
        editor.deselectAll();
    }
    editor.identifyNamedCells(["0|01", "0|02", "0|12"]);
    for (let i = 1; i < c; i++) {
        editor.identifyNamedCells([`${i}|01`, `${i}|12`]);
        editor.identifyNamedCells([`${i}|02`, `${i-1}|01`]);
    }
    editor.renameMany(Array(c).fill(0).map((_, i) => [`${i}|01`, `e${i}`]))
    editor.rename("00", 'v');
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