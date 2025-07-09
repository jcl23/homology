import React, { createContext, useContext, useState } from 'react';
import { CallBackProps } from 'react-joyride';

type TutorialContextType = {
  isTutorialActive: boolean;
  setTutorialActive: (active: boolean) => void;
  stepIndex: number;
  setStepIndex: (index: number) => void; 
  handleJoyrideCallback?: (data: CallBackProps) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
    const [isTutorialActive, setTutorialActive] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const {status } = data;
    if (status === 'finished' || status === 'skipped') {
      setTutorialActive(false);
      setStepIndex(0);
    }
    if (status === 'running') {
      setTutorialActive(true);
    }
  }
    return (
        <TutorialContext.Provider value={{ isTutorialActive, setTutorialActive, stepInddex, setStepIndex, handleJoyrideCallback }}>
            {children}
        </TutorialContext.Provider>
    );
}

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) throw new Error("Should be within a tutorialprovider component, check");
  return context;
};
