import React from 'react';
import { TooltipRenderProps } from 'react-joyride';
import { useTutorial } from './TutorialContext';
import { LinkedStep } from './steps';

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
  const { stepIndex, goToStep, back } = useTutorial();
  if (!("next" in step_)) return <div>Invalid step configuration</div>;
  const step = step_ as LinkedStep;
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
    tooltipProps.style = {
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
            <button className="react-joyride__tooltip__edge button" {...closeProps}>
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
          step.next.map(nextStep => (
            <button
              key={nextStep.index}
              className="react-joyride__tooltip__edge button"
              onClick={() => {
                goToStep(nextStep.index);
              }}
            >
              {nextStep.title || "Next"}
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