import React, { useEffect } from 'react';
import { TooltipRenderProps } from 'react-joyride';
import { useTutorial } from './TutorialContext';
import { LinkedStep } from './steps';
import { string } from 'three/webgpu';

const elToShapePercents = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  return `
    ${rect.left / windowWidth * 100}% ${rect.top / windowHeight * 100}%,
    ${rect.right / windowWidth * 100}% ${rect.top / windowHeight * 100}%,
    ${rect.right / windowWidth * 100}% ${rect.bottom / windowHeight * 100}%,
    ${rect.left / windowWidth * 100}% ${rect.bottom / windowHeight * 100}%,
    ${rect.left / windowWidth * 100}% ${rect.top / windowHeight * 100}%
  `;
}
const MyTooltip: React.FC<TooltipRenderProps> = ({
  step: step_,
  primaryProps,
  tooltipProps,
  backProps,
  closeProps,
  skipProps,
  isLastStep,
  index,
}) => {
  const { stepIndex, goToStep, back, tutorialStepConditionProps } = useTutorial();
  if (!("next" in step_)) return <div>Invalid step configuration</div>;
  const step = (step_ as any) as LinkedStep;
  
  let bodyStyle = {};
  let buttonHolderStyle = {};
  if (step.modal) {
    bodyStyle = {
      fontSize: "large",
      textAlign: "center",
      transitionProperty: "none!important",
    };
    buttonHolderStyle = {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      border: "1px solid #red",
    };
    (tooltipProps as any).style = {
      width: "600px",
      height: "700px",
      position: "absolute",
      fontSize: "x-large!important!important",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
    }
  }
  useEffect(() => {

    const targetEls = document.querySelectorAll(step.target || '.canvas');
    const overlay = document.querySelector('.react-joyride__overlay') as HTMLElement;
    if (targetEls && overlay) {
      // https://stackoverflow.com/questions/48737295/create-a-reverse-clip-path-css-or-svg
      const strings = [...targetEls].map(el => elToShapePercents(el as HTMLElement));
      const temp = "30% 30%, 70% 30%, 70% 70%, 30% 70%, 30% 30%, 10% 10%, 20% 10%, 20% 20%, 10% 20%, 10% 10%, 30% 30%";
      overlay.style.setProperty('--shape',  temp);
      // get first point of first string
      const bigString = strings.map((s,i) => {
        try {
          return s + (strings[i - 1] ? `,${strings[0].split(',')[0].trim()}` : "");
        } catch (e) {
          throw new Error(`strings[i - 1]: ${strings[i - 1]} at index ${i} in ${strings}`);
        }
      
      }).join(', ');
     
      overlay.style.setProperty('--shape',  bigString);
      // overlay.style.setProperty('--shape',  boundsAsPercentDefinedShape);

    } else {
      if(targetEls) {
        // throw new Error(`Overlay element element not found for step: ${step.target}`);
      } else {
        console.warn(`Target element not found for step: ${step.target}`);
      }
    }
    
    // Cleanup function
    return () => {
      // Undo changes if needed when component unmounts
      if (targetEls) {
      // targetEl.removeAttribute('style');
      }
    };
  }, [step]); // Re-run when step changes


  useEffect(() => {
    if (step.pass && step.pass(tutorialStepConditionProps)) {
      setTimeout(() => goToStep(step.next[0].index),250);
    }
  }, [tutorialStepConditionProps, step.pass]);
  return (
    <div className="react-joyride__tooltip" {...tooltipProps}>
      <div className="react-joyride__tooltip__container">
        <div className="react-joyride__tooltip__edge">
            {index > 0 && (
                <button className="react-joyride__tooltip__header button" onClick={back}>
                    Back
                </button>
            )}
            {step.title && (
                <div className="react-joyride__tooltip__title">{step.title}</div>
            )}
            <button className="react-joyride__tooltip__edge button" style={{minWidth: "20px", paddingLeft: "60px!important"}} {...closeProps} >
              &times;
            </button>
        </div>
        <div className="react-joyride__tooltip__body" style={bodyStyle}>
          {step.content}
          {/* {step.index} */}
        </div>
      </div>
      <div className="react-joyride__tooltip__edge" style={buttonHolderStyle}>
        {
          step.pass ? <> </>
          :
          step.next.map(nextStep => (
            <button
              key={nextStep.index}
              className="react-joyride__tooltip__edge button"
              onClick={() => {
                goToStep(nextStep.index);
              }}
            >
              {nextStep.button || nextStep.title || "Next"}
            </button>
          ))
        }
        {/* {index > 0 && (
          <button className="react-joyride__tooltip__edge button" {...backProps}>
            Back
          </button>
        )}
        
        {!isLastStep && (
          <button className="react-joyride__tooltip__edge button" {...skipProps}>
            Skip
          </button>
        )}
         */}
       
      </div>
    </div>
  );
};

export default MyTooltip;