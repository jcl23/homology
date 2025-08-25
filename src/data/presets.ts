import { texToUnicode } from "../comps/board/Label";
import { CWComplexStateEditor, EditorState } from "../hooks/useCWComplexEditor";
import { CWComplexEditStep } from "../logic/steps";
import { CWComplex, getStartStep  } from "../math/CWComplex";


export type Preset = (editor: CWComplexStateEditor) => void;


const angled = (a: number, r: number, y = 0): [number, number, number] => {
    return [r * Math.cos(Math.PI * 2 * a), y, r * Math.sin(Math.PI * 2 * a)];
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

    editor.rename("a,c,d", "B");
    editor.rename("b,c,d", "A");
    editor.rename("a,b,d", "C");
    editor.rename("a,b,c", "D");
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
    editor.identifyNamedCells(["a,b", "c,d"]);
    editor.identifyNamedCells(["a,d", "b,c"]);
    editor.rename("a,b", "f");
    editor.rename("a,d", "g");
    editor.rename("a,c", "h");
    editor.rename("a,c,d", "A");
    editor.rename("a,b,c", "B");
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
    editor.identifyNamedCells(["a,d", "b,c"]);
    editor.identifyNamedCells(["a,c", "b,d"]);
    // editor.rename("ad", "f");
    // editor.rename("ac", "g");
    // editor.rename("cd", "h");
    // editor.rename("acd", "A");
    // editor.rename("bcd", "B");

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
    editor.rename("a,b,c", "A");
    editor.rename("a,d,c", "B");
    
}

export const KleinBottle2: Preset = (editor: CWComplexStateEditor) => {
    editor.reset();
    Tetra(editor);
        editor.setMeta({ name: "Klein Bottle ($K= \\Delta^3/\\sim$)" , 
        description: "Hatcher 2.1.2" 
        });
    editor.selectAll();
    editor.addCell();

    editor.deselectAll();
    editor.identifyNamedCells(["a,b", "b,d"]);
    editor.identifyNamedCells(["a,c", "c,d"]);
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
        editor.rename(`${i}0,${i}1`, `${i}|01`);
        editor.rename(`${i}0,${i}2`, `${i}|02`);
        editor.rename(`${i}1,${i}2`, `${i}|12`);
        editor.rename(`${i}0,${i}1,${i}2`, `A${i}`);
        editor.deselectAll();
    }
    editor.identifyNamedCells(["0|01", "0|02", "0|12"]);
    for (let i = 1; i < c; i++) {
        editor.identifyNamedCells([`${i}|01`, `${i}|12`]);
        editor.identifyNamedCells([`${i}|02`, `${i-1}|01`]);
    }
    editor.renameMany(Array(c).fill(0).map((_, i) => [`${i}|01`, `e_${i}`]))
    editor.rename("00", 'v');
}
export const LensSpace: Preset = (editor: CWComplexStateEditor) => {
    editor.setMeta({ name: "Lens Space" , description: "Hatcher 2.1.8"  });
    const n = 6;
    for (let i = 0; i < n; i++) {
        editor.addVertex(angled(i / n, 2, 2), `${i}`);
    }
    
    editor.selectAll();
    // editor.deselectRep("0 0");
    editor.identify(false);
    editor.deselectAll();
    const a = editor.addVertex([0, 0, 0], "a");
    const b = editor.addVertex([0, 4, 0], "b");


    editor.selectRep(`0 ${n}, 0 ${n + 1}`);
    editor.addCell();
    editor.deselectAll();
    editor.selectRep(`0 0`);
    for (let i = 0; i < n; i++) {
        editor.deselectRep(`0 ${((i+n-1)%n)+0}`);
        editor.selectRep(`0 ${((i+1)%n)+0}`);
        editor.addCell();
    }
    editor.deselectAll();
    editor.selectRep(`1 0`);
    for (let i = 0; i < n * 3 - 1; i++) {
        editor.setSelectedById(`1 0, 1 ${(i % n) + 1}`);
        editor.addCell();
        // editor.addCell();
    }

    editor.deselectAll();
    const p = (i) => `${i%n},${(i + 1)%n}`; 
    for (let i = 0; i < n; i++) {
        editor.identifyNamedCells([`${p(i)},a`, `${p(i + 1)},b`]);
    }
    // for (let i = 0; i < n; i++) {
    //     editor.rename(`${p(i)}a`, `A${i + 1}`);
    //     editor.rename(`${i}ab`, `B${i + 1}`);
    // }
    
    // for (let i = 0; i < n; i++) {
    //     editor.rename(`${i}a`, `f${i + 1}`);
    //     // editor.rename(`${i}ab`, `B${i + 1}`);
    // }
    
    // editor.rename("ab", "p");
    // editor.rename("10", "b");
    // editor.rename("0", "v");
    // editor.rename("a", "w");
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