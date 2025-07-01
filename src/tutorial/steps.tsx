import { Step } from "react-joyride";



// type BranchStep = {
//     branches: GeneralStep[][];
//     content: string;
//     target: string;
// }
// type GeneralStep = BranchStep | Step;
// type LinkedStep = GeneralStep & { last: LinkedStep | null; next?: LinkedStep[] }

// type IndexedStep =  Step & { last: number, index: number, next: number };

// const printSteps = (steps: LinkedStep[], indent = 0): void => {
//     for (let step of steps) {
//         console.log(" ".repeat(indent) + step.target + ": " + step.content + (("last" in step) ? " (last: " + step.last.target + ")" : ""));
//         if ("branches" in step) {
//             for (let branch of step.branches) {
//                 printSteps(branch, indent + 2);
//             }
//         }
//     }
// }


// export const compileBranchedSteps = (steps: LinkedStep[]): LinkedStep[] => {
//     let currentIndex = 0;
//     const iter = (steps: LinkedStep[], outerLast?: GeneralStep): void => {
//         let last: LinkedStep;
//         for (let step of steps) {
//             step.last = outerLast ?? last;
//             last = step;
//             if ("branches" in step) {
//                 for (let branch of step.branches) {
//                     iter(branch, last);
//                 }
//             }
//         }
//     }
//     iter(steps);
//     printSteps(steps);
//     return steps;
    
// }

export const steps: GeneralStep[] = [
    {
        target: 'body',
        content: 'Welcome to ',
    },
    {
        target: '.canvas',
        content: 'This is the main area where you can visualize and interact with your space.',
    },
    {
        target: '.tour_mode_buttons',
        content: <div>'Select from four modes to manipulate the space: Add, Select, Move, and Remove.'</div>,
    },
    {
        target: 'body',
        content: "Choose from the following paths",
        branches: [
            [
                {
                    target: '.path1',
                    content: 'Path 1: Basic Operations',
                },
                {
                    target: '.path2',
                    content: 'Path 2: Advanced Features',
                }
            ],
            [
                {
                    target: '.path3',
                    content: 'Path 3: Customization Options',
                },
                {
                    target: '.path4',
                    content: 'Path 4: Help and Support',
                }
            ]
        ]
    }
]
