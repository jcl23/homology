import React, { createContext, useContext, useState } from 'react';
import { CallBackProps } from 'react-joyride';
import { EditOptions, ViewOptions } from '../App';
import { CWComplexStateEditor, EditorState } from '../hooks/useCWComplexEditor';

export type TutorialContextType = {
  isTutorialActive: boolean;
  setTutorialActive: (active: boolean) => void;
  stepIndex: number;
  goToStep: (index: number) => void; 
  back: () => void;
  handleJoyrideCallback?: (data: CallBackProps) => void;
  
  tutorialStepConditionProps?: TutorialStepConditionProps;  
};
export type TutorialStepConditionProps = {
  editOptions: EditOptions;
  editorState: EditorState;
  complexEditor: CWComplexStateEditor;
  viewOptions: ViewOptions;
}
type TutorialProviderProps = TutorialStepConditionProps & {
  children: React.ReactNode;
};
const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider(props: TutorialProviderProps) {
  const { children, ...tutorialStepConditionProps } = props;
  const [isTutorialActive, setTutorialActive] = useState(false);
  const [stepIndices, setStepIndices] = useState([0]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const {status } = data;
    if (status === 'finished' || status === 'skipped') {
      setTutorialActive(false);
      setStepIndices([0]);
    }
    if (status === 'running') {
      setTutorialActive(true);
    }
  }

  const back = () => {
    setStepIndices((prev) => {
      if (prev.length <= 1) return prev; // Can't go back if there's only one step
      return prev.slice(0, -1); // Remove the last step
    });
  };

  const goToStep = (index: number) => {
    if (index < 0) {
      console.warn(`Invalid step index: ${index}`);
      return;
    }
    setStepIndices((prev) => {
      // add a step to the stack
      const newIndices = [...prev];
      newIndices.push(index);
      return newIndices;
    });
  };
  const stepIndex = stepIndices[stepIndices.length - 1];
    return (
        <TutorialContext.Provider value={{ isTutorialActive, setTutorialActive, stepIndex, back, goToStep, handleJoyrideCallback, tutorialStepConditionProps }}>
            {children}
        </TutorialContext.Provider>
    );
}

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) throw new Error("Should be within a tutorialprovider component, check");
  return context;
};
