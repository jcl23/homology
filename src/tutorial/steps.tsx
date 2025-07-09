import { create } from "@mui/material/styles/createTransitions";
import { Step } from "react-joyride";
import { all, step } from "three/webgpu";

// type StepNode = {
//     step: Step;
//     last: StepNode | null;
//     next: StepNode[];
//     isBranch: boolean;
// }

export type CustomStep = {
    content: string | React.ReactNode;
    target?: string;
    title?: string;
    modal?: boolean;
}
export type BranchStep = CustomStep & { branches: GeneralStep[][]; }
export type GeneralStep = BranchStep | CustomStep;

type BranchedStepChunks = CustomStep & {
    branches: GeneralChunkedSteps[][][]
}
type GeneralChunkedSteps = BranchedStepChunks | CustomStep

export type IndexedStep = CustomStep & { index: number; }


export type LinkedStep = IndexedStep & { next: LinkedStep[]; }

type IndexedChunkedStep = GeneralChunkedSteps & { index: number; };

export const minimalStartStep: LinkedStep = {
    target: 'body',
    content: "Welcome to the tutorial! Click next to start.",
    placement: 'center',
    disableBeacon: true,
    disableCloseOnEsc: true,
    disableOverlayClose: true,
    spotlightClicks: true,
    index: 0,
    next: [],
};

export const chunkSteps = (steps: GeneralStep[]): GeneralChunkedSteps[][] => {
    let chunks: GeneralChunkedSteps[][] = [];
    let chunk: GeneralChunkedSteps[] = [];
    for (let step of steps) {
        if ("branches" in step) {
            const chunkedBranchStep = {
                ...step,
                branches: step.branches.map(chunkSteps)
            } 
            chunk.push(chunkedBranchStep);
            chunks.push(chunk)
            chunk = [];
        } else {
            chunk.push(step);
        }
    }
    if (chunk.length) chunks.push(chunk);
    return chunks;
}
const log = (i: number, msg: string): void => {
    console.log(`${'  '.repeat(i)}${msg}`)
}
export const printChunkedSteps = (chunkedSteps: GeneralChunkedSteps[][], level = 0) => {
    for (let i = 0; i < chunkedSteps.length; i++) {
        const chunk = chunkedSteps[i];
        log(level, `- Chunk: ${chunk.length} steps`)
        for (let step of chunk) {
            if ("branches" in step) {
                log(level + 1, `- Branched Step: ${step.content}`);
                step.branches.forEach((branch, j) => {
                    log(level + 2, `- Branch ${j}:`);
                    printChunkedSteps(branch, level + 3);
                });
            } else {
                log(level + 1, `- Step: ${step.content}`);
            }
        }
    }
}

export const linkChunkedSteps = (chunkedSteps: GeneralChunkedSteps[][], forwardStep?: LinkedStep): LinkedStep => {
    let latest: LinkedStep;
    for (let i = chunkedSteps.length - 1; i >= 0; i--) {
        const chunk = chunkedSteps[i];
        for (let j = chunk.length - 1; j >= 0; j--) {
            const step = chunk[j];
            const next = "branches" in step
                ? step.branches.map(branch => {
                    return linkChunkedSteps(branch, forwardStep);
                })
                : (forwardStep ?
                [forwardStep]
                : []);
            const linkedStep = step as LinkedStep;
            linkedStep.next = next;
            if ("branches" in linkedStep) delete linkedStep.branches; 
            
            forwardStep = linkedStep;
        }
    }
    return forwardStep;    
}

export const getSetFromLinkedStep = (step: LinkedStep, set = new Set<LinkedStep>()): Set<LinkedStep> => {
    if (set.has(step)) return set; // avoid loops
    set.add(step);
    step.next.forEach(nextStep => getSetFromLinkedStep(nextStep, set));
    return set;
}

export const getStepSetFromChunks = (chunkedSteps: GeneralChunkedSteps[][], set = new Set<GeneralChunkedSteps>()): Set<GeneralChunkedSteps> => {
    for (let chunk of chunkedSteps) {
        for (let step of chunk) {
            if (set.has(step)) continue; // avoid loops
            set.add(step);
            if ("branches" in step) {
                step.branches.forEach(branch => getStepSetFromChunks(branch, set));
            }
        }
    }
    return set;
}


export const testSteps: GeneralStep[] = [
    { target: 'body', content: "Start" },
    { target: 'body', content: "Pivot", modal: true,
        branches: [
            [
                { target: 'body', content: "A" },
                { target: 'body', content: "B" },
            ], [
                { target: 'body', content: "C" },
                { target: 'body', content: "D" },
            ]
        ]
    },
    { target: 'body', content: "ShouldBeNewChunkStart" },
    { target: 'body', content: "X" },
    { target: 'body', content: "Pivot2",
        branches: [
            [
                { target: 'body', content: "InnerPivot",
                    branches: [
                        [
                            { target: 'body', content: "X", 
                                branches: [
                                    [ { target: 'body', content: "Alpha" } ],
                                    [ { target: 'body', content: "Beta" } ], 
                                ]
                             },
                            { target: 'body', content: "Y" }
                        ], [
                            { target: 'body', content: "Z" }
                        ]
                    ]
                },
            ], [
                { target: 'body', content: "456" },
            ]
        ]
     },
    { target: 'body', content: "ShouldBeNewChunkStartAgain" },
    { target: 'body', content: "Z" },
]
export const steps1: GeneralStep[] = [
    { target: 'body', content: "1", title: "start" },
    { target: 'body', content: "2", title: "Step 2"  },
    { target: 'body', content: "3" },
    { target: 'body', content: "4",
        branches: [
            [
                { target: 'body', content: "A" },
                { target: 'body', content: "B",
                    branches: [
                        [
                            { target: 'body', content: "X" },
                            { target: 'body', content: "Y" }
                        ], [
                            { target: 'body', content: "Z" }
                        ]
                    ]
                },
                { target: 'body', content: "C" },
            ], [
                { target: 'body', content: "D" },
                { target: 'body', content: "E" },
            ]
        ]
    },
    { target: 'body', content: "5" },
];

const chunked = chunkSteps(testSteps);
const allSteps = [...getStepSetFromChunks(chunked)];
for (let index = 0; index < allSteps.length; index++) {
    const step = allSteps[index];
    (step as IndexedStep).index = index;
}
console.log("Set from Chunked Step:", );

const linked = linkChunkedSteps(chunked);
// a type for indexed chunked steps:
const indexedSteps = allSteps as IndexedChunkedStep[];

// console.log("Chunked Steps:");
// printChunkedSteps(chunked);  
// console.log("Linked Steps:");
// console.log(linked);

console.log("(test) Linked Steps:", linked);

/**
 * Transforms an array of GeneralSteps into a linked DAG structure.
 * 
 * @param steps Array of steps to process
 * @returns Array of all the linked steps with indices
 */

export const linkStepTree = (steps: GeneralStep[]): LinkedStep[] => {
    // First chunk the steps
    const chunkedSteps = chunkSteps(steps);
    
    // Get all unique steps from the chunks and index them
    const allSteps = [...getStepSetFromChunks(chunkedSteps)];
    
    // Link the steps to create the DAG structure
    const linkedStartStep = linkChunkedSteps(chunkedSteps);
    for (let index = 0; index < allSteps.length; index++) {
        const step = allSteps[index];
        (step as IndexedStep).index = index;
    }
    

    return allSteps as LinkedStep[]; // Return the array of linked steps with indices
};
export const printLinkedDebug = (linkedSteps: LinkedStep[]) => {
    console.log("Linked Steps Debug:");
    linkedSteps.forEach(step => {
        let contentString = typeof step.content === 'string' ? step.content : JSON.stringify(step.content);
        console.log(`Step ${step.index}: ${step.title ?? contentString}`);
        if (step.next.length > 0) {
            console.log(`  Next steps: ${step.next.map(s => s.title ?? s.index).join(', ')}`);
        } else {
            console.log(`  No next steps`);
        }
    });
}
// console.log("Set from Linked Step:", getSetFromLinkedStep(linked));


// We should assign to each GeneralStep:
// "last" being the recentmost upper step
// "next" being the next lower step in the dag


