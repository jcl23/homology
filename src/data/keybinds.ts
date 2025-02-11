import { EditOptions, SetEditOptions, SetViewOptions, ViewOptions } from "../App";
import { CWComplexStateEditor } from "../hooks/useCWComplexEditor"
import { MOVE_STEP } from "./configuration";

export type Keybinds = {
    [key: string]: (e: CWComplexStateEditor, setEditOptions: SetEditOptions, setViewOptions: SetViewOptions) => void;
}

const debugOn: Record<string, boolean> = {
    "f": false,
    "a": false,
    "s": false,
    "d": false,
    "c": false,
    "[": false,
    "]": false,
    "i": true,
};
export const keybinds: Keybinds = {
    // *fill*: add a cell
    f: (e, seo, svo) => {
        if (debugOn["f"]) debugger;
        console.notify("Fill", "Adding a cell");
        e.addCell();
    },
    // *add*: select add vertex
    a: (e, setEditOptions, __) => {
        if (debugOn["a"]) debugger;
        setEditOptions(options => {
            return {
                ...options,
                mode: "add"
            }
        });
    },
    // *select*: select select vertex
    s: (_, setEditOptions, __) => {
        if (debugOn["s"]) debugger;
        setEditOptions(options => {
            return {
                ...options,
                mode: "select"
            }
        });
    },
    w: (e, _, __) => {
        if (debugOn["s"]) debugger;
       e.selectAll();
    },

    // *remove*: select remove vertex
    d:  (e, _, __) => {
        if (debugOn["s"]) debugger;
       e.deleteCells();
    },
    Ctrld:  (e, _, __) => {
        if (debugOn["s"]) debugger;
       e.reset();
    },
    c: (e, _, __) => {
    // clear selection
        if (debugOn["c"]) debugger;
        e.deselectAll();
    },
    ['[']: (_, setEditOptions, __) => {
    // raise grid
        if (debugOn["["]) debugger;
        setEditOptions(options => {
            return {
                ...options,
                gridHeight: options.gridHeight - 1
            }
        });
    },
    [']']: (_, setEditOptions, __) => {
    // lower grid
        if (debugOn["]"]) debugger;
        setEditOptions(options => {
            return {
                ...options,
                gridHeight: options.gridHeight + 0.5
            }
        });
    },
    i: (e, seo, svo) => {
        // identify
        if (debugOn["i"]) debugger;
        // depending on what's selected, identify the selected cells
        e.identify();
    }, 
    m: (_, setEditOptions, __) => {
        if (debugOn["m"]) debugger;
        // set mode to move
        setEditOptions(options => {
            return {
                ...options,
                mode: "move"
            }
        });
    },
    t: (e, _, __) => {
        // toggle selection
        if (debugOn["t"]) debugger;
        e.reset();
    },
    k: (_, __, setViewOptions) => {
        // clear selection
        if (debugOn["c"]) debugger;
        setViewOptions(options => {
            return {
                ...options,
                nameState: [true, true, true, true]
            }
        });
    },
    Ctrlz: (e, _, __) => {
        // undo
        e.undo();
    },
    Ctrla: (e, _, __) => {
        // select all
        e.selectAll();
    },  
    ArrowUp: (e, _, __) => {
        // move up
        e.shiftSelection(0, MOVE_STEP, 0);
    },
    ArrowDown: (e, _, __) => {
        // move down
        e.shiftSelection(0, -MOVE_STEP, 0);
    },
    ArrowLeft: (e, _, __) => {
        // move left
        e.shiftSelection(-MOVE_STEP, 0, 0);
    },
    ArrowRight: (e, _, __) => {
        // move right
        e.shiftSelection(MOVE_STEP, 0, 0);
    },
    // use comma
    ',': (e, _, __) => {
        // move back
        console.notify("Moving back");
        e.shiftSelection(0, 0, -MOVE_STEP);
    },
    // use period
    '.': (e, _, __) => {
        // move forward
        e.shiftSelection(0, 0, MOVE_STEP);
    },
}
// a list of strings, whos keys are the keybinds, given a type annotation as being the keys