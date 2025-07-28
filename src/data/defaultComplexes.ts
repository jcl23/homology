import { CWComplexStateEditor } from "../hooks/useCWComplexEditor";
import { CWComplexEditStep } from "../logic/steps";
import { CWComplex } from "../math/CWComplex";

export const RP2_pre_quotient = function(): CWComplex {
    const RP2 = new CWComplex();
    try {
        RP2.addVertex([0, 0, 0], "a");
        RP2.addVertex([1, 0, 1], "d");
        RP2.addVertex([1, 0, 0], "b");
        RP2.addVertex([0, 0, 1], "c");
        RP2.addEdgeByNames(["a", "b"], "ab");
        RP2.addEdgeByNames(["b", "d"], "bd");
        RP2.addEdgeByNames(["c", "d"], "cd");
        RP2.addEdgeByNames(["c", "a"], "ac");
        RP2.addEdgeByNames(["b", "c"], "bc");
        RP2.addFaceByNames(["ab", "ac", "bc"], "abc");
        RP2.addFaceByNames(["bd", "bc", "cd"], "bcd");
    } catch (error) {
        console.error("Error in RP2_pre_quotient:", error);
    }
    return RP2;
}

const RP2 = function() {
    const complex = RP2_pre_quotient();
    try {
        complex.identifyEdgesByName(["ab", "cd"]);
        complex.identifyEdgesByName(["bd", "ac"]);
    } catch (error) {
        console.error("Error in RP2:", error);
    }
    return complex;
}

export type EditorState = {
    history: CWComplexEditStep[];
    complex: CWComplex;
    selectedKeys: Set<string>;
}

type LikeDispatch = EditorState | ((state: EditorState) => EditorState);
const Test1 = function(editor: CWComplexStateEditor): void {

    editor.addVertex([0, 0, 5], "a");
    editor.addVertex([1, 0, 6], "d");
    editor.addVertex([1, 0, 5], "b");
    editor.selectAll();
    editor.addCell();
    editor.addCell();
}

const Empty = function(editor: CWComplexStateEditor): void {
    editor.reset();
}
const KleinBottle_pre_quotient = function(): CWComplex {
    const KB = new CWComplex();
    try {
        KB.addVertex([0, 0, 0], "a");
        KB.addVertex([1, 0, 0], "b");
        KB.addVertex([0, 0, 1], "c");
        KB.addVertex([1, 0, 1], "d");
        KB.addEdgeByNames(["a", "b"], "ab");
        KB.addEdgeByNames(["b", "d"], "bd");
        KB.addEdgeByNames(["d", "c"], "cd");
        KB.addEdgeByNames(["c", "a"], "ac");
        KB.addEdgeByNames(["b", "c"], "bc");
        KB.addFaceByNames(["ab", "ac", "bc"], "abc");
        KB.addFaceByNames(["bd", "bc", "cd"], "bcd");
    } catch (error) {
        console.error("Error in KleinBottle_pre_quotient:", error);
    }
    return KB;
}

const KleinBottle = function() {
    const complex = KleinBottle_pre_quotient();
    try {
        complex.identifyEdgesByName(["ab", "cd"]);
        complex.identifyEdgesByName(["bd", "ac"]);
    } catch (error) {
        console.error("Error in KleinBottle:", error);
    }
    return complex;
}

const Sphere = function() {
    const s = new CWComplex();
    try {
        s.addVertex([0, 0, 0], "a");
        s.addVertex([1, 0, 0], "b");
        s.addVertex([0, 0, 1], "c");
        s.addEdgeByNames(["a", "b"], "ab");
        s.addEdgeByNames(["b", "c"], "bc");
        s.addEdgeByNames(["a", "c"], "ca");
        s.addFaceByNames(["ab", "bc", "ca"], "abc");
        s.identifyEdgesByName(["ab", "bc", "ca"]);
    } catch (error) {
        console.error("Error in Sphere:", error);
    }
    return s;
}

// export { RP2, KleinBottle, Sphere, Test1 };
const defaultPreset = Empty;
export { RP2, KleinBottle, Sphere, Test1, defaultPreset };