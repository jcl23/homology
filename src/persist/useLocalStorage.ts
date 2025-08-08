import { useState, useEffect } from "react";
import { CWComplexStateEditor, EditorState, makeDefault, useEditComplex } from "../hooks/useCWComplexEditor";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

type EditorDict = Record<string, CWComplexStateEditor>;
export function usePersistedEditors() {
    const [editors, setEditors] = useLocalStorage<EditorDict>("complexEditors", { ["defaultComplex"]: useEditComplex()[1] });
    const [currentEditor, setCurrentEditor] = useState(null);
    const newEditor = (editor) => {
        const newOne = useEditComplex()[1];
        
    }

    const removeEditor = (editor) => {
        // setEditors((prevEditors) => prevEditors.filter(e => e !== editor));
        // if (currentEditor === editor) {
        //     setCurrentEditor(null);
        // }
    }


}