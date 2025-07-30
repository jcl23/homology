import { GeneralStep, linkStepTree, printLinkedDebug } from "./steps";
import branchA from "./branches/branchBeginner"
import branchB from "./branches/branchHomology";
import branchC from "./branches/branchTechnical";
let self = "react-joyride__tooltip";
export const tutorialStepArray: GeneralStep[] = [
    {
        target: '.modalHolder',
        modal: true,
        content: `Welcome!! \n This is an app for building  and manipulating topological spaces using Δ-complexes, while also computing their homology groups.
            This app was built to be useful for students, educations or researchers learning about or researching algebraic topology. A guided tour is available to help you get started. Follow branches based on your interest and expertise level.`,
    
        title: 'Welcome to the Δ-complex editor!',
        branches: [
             branchC, branchA, branchB,
        ]
    },

    {
        target: '.modalHolder',
        modal: true,
        content: <div>To be continued... last update 7/28/2025</div>,
    },
    // {
    //     target: 'body',
    //     content: "Choose from the following paths",
    //     branches: [
    //         [
    //             {
    //                 title: 'Path 1',
    //                 target: 'body',
    //                 content: 'Path 1: Basic Operations',
    //             },
    //             {
    //                 target: 'body',
    //                 content: 'Path 1.1: Advanced Features',
    //             }
    //         ],
    //         [
    //             {
    //                 title: 'Path 2',

    //                 target: 'body',
    //                 content: 'Path 2: Customization Options',
    //             },
    //             {
    //                 target: 'body',
    //                 content: 'Path 2.1: Help and Support',
    //             }
    //         ]
    //     ]
    // },
    // {
    //     target: 'body',
    //     content: <div>'Thank you!'</div>,
    // },
]
console.log("TutorialArray steps!")

function addDefaultTargets(steps: GeneralStep[]): GeneralStep[] {
    return steps.map(step => {
        if (!step.target) {
            step.target = '.modalHolder';
            step.modal = true;
        }
        if ("branches" in step) {
            step.branches = step.branches.map(branch => {
                if (Array.isArray(branch)) {
                    return addDefaultTargets(branch);
                } else {
                    return branch; 
                }
            });
        }
        
        return step;
    });
}

addDefaultTargets(tutorialStepArray);



export const tutorialSteps = linkStepTree(tutorialStepArray);
// tutorialStepArray.forEach((step, index) => {
//     console.log(`(${index} / ${step.index})`);
// });
console.log("End ")
printLinkedDebug(tutorialSteps);