import React, { createContext, useContext, useState } from 'react';

type TutorialContextType = {
  isTutorialActive: boolean;
  setTutorialActive: (active: boolean) => void;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
    const [isTutorialActive, setTutorialActive] = useState(false);

    return (
        <TutorialContext.Provider value={{ isTutorialActive, setTutorialActive }}>
            {children}
        </TutorialContext.Provider>
    );
}

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) throw new Error("Should be within a tutorialprovider component, check");
  return context;
};
