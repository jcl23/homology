import { create } from "@mui/material/styles/createTransitions";
import { Step } from "react-joyride";
import { step } from "three/webgpu";

// type StepNode = {
//     step: Step;
//     last: StepNode | null;
//     next: StepNode[];
//     isBranch: boolean;
// }


export type BranchStep = Step & { branches: GeneralStep[][]; }
export type GeneralStep = BranchStep | Step;

type BranchedStepChunks = Step & {
    branches: GeneralChunkedSteps[][][]
}
type GeneralChunkedSteps = BranchedStepChunks | Step

type IndexedStep = Step & { index: number; }


type LinkedStep = IndexedStep & { next: LinkedStep[]; }


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

export const linkChunkedSteps = (chunkedSteps: GeneralChunkedSteps[][], forwardStep: LinkedStep = minimalStartStep): LinkedStep => {
    let latest: LinkedStep;
    for (let i = chunkedSteps.length - 1; i >= 0; i--) {
        const chunk = chunkedSteps[i];
        for (let j = chunk.length - 1; j >= 0; j--) {
            const step = chunk[j];
            const next = "branches" in step
                ? step.branches.map(branch => {
                    return linkChunkedSteps(branch, forwardStep);
                })
                : [forwardStep];
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
    { target: 'body', content: "Pivot",
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
    { target: 'body', content: "1" },
    { target: 'body', content: "2" },
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

// console.log("Chunked Steps:");
// printChunkedSteps(chunked);  
// console.log("Linked Steps:");
// console.log(linked);

console.log("Linked Steps:", linked);
// console.log("Set from Linked Step:", getSetFromLinkedStep(linked));


// We should assign to each GeneralStep:
// "last" being the recentmost upper step
// "next" being the next lower step in the dag

// export const steps: GeneralStep[] = [
    //     {
//         target: 'body',
//         content: 'Welcome to ',
//     },
//     {
//         target: '.canvas',
//         content: 'This is the main area where you can visualize and interact with your space.',
//     },
//     {
//         target: '.tour_mode_buttons',
//         content: <div>'Select from four modes to manipulate the space: Add, Select, Move, and Remove.'</div>,
//     },
//     {
//         target: 'body',
//         content: "Choose from the following paths",
//         branches: [
//             [
//                 {
//                     target: '.path1',
//                     content: 'Path 1: Basic Operations',
//                 },
//                 {
//                     target: '.path2',
//                     content: 'Path 2: Advanced Features',
//                 }
//             ],
//             [
//                 {
//                     target: '.path3',
//                     content: 'Path 3: Customization Options',
//                 },
//                 {
//                     target: '.path4',
//                     content: 'Path 4: Help and Support',
//                 }
//             ]
//         ]
//     }
// ]
