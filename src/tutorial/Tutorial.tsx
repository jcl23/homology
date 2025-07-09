// import { useState } from "react";
// import { History } from "../comps/history/history";
// import React from "react";
// type Tutorial = {
//     history: History;
//     steps: TutorialStep[];
//     setHistory: React.Dispatch<React.SetStateAction<History>>;
// }

// type TutorialStep = {
//     content: string;
//     indexInHistory: number;
// }

// export const Tutorial = ({ history, steps, setHistory }: Tutorial) => {
//     // the tutorial should set the histoy to be the current portion
//     // of the history that the tutorial is on. For example if it is on step 4, it should have the history
//     // up to the index specified by the property called indexInHistory.

//     const [currentStep, setCurrentStep] = useState(0);

//     const goToNextStep = () => {
//         if (currentStep < steps.length - 1) {
//             setCurrentStep(currentStep + 1);
//             setHistory(history.slice(0, steps[currentStep + 1].indexInHistory + 1));
//         }
//     };

//     const goToPreviousStep = () => {
//         if (currentStep > 0) {
//             setCurrentStep(currentStep - 1);
//             setHistory(history.slice(0, steps[currentStep - 1].indexInHistory + 1));
//         }
//     };

//     return (
//         <div>
//             <div>{steps[currentStep].content}</div>
//             <button onClick={goToPreviousStep} disabled={currentStep === 0}>
//                 Previous
//             </button>
//             <button onClick={goToNextStep} disabled={currentStep === steps.length - 1}>
//                 Next
//             </button>
//         </div>
//     );
// };