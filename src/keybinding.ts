import { useEffect } from "react";
import { keybinds } from "./data/keybinds";
import { useTutorial } from "./tutorial/TutorialContext";
let keyModifierStates = {
    shift: false,
    control: false,
}
const handleKeydown =
    //(keyModifierStates: { shift: boolean, control: boolean }) =>
    (
        setEditOptions: React.Dispatch<React.SetStateAction<any>>,
        setViewOptions: React.Dispatch<React.SetStateAction<any>>,
        complexEditor: any,
    ) =>
        (event: KeyboardEvent) => {
            if (event.repeat) {
                event.preventDefault();
                event.stopPropagation();
                return;
            };
            console.log("Successfuly using the new keybinding system (keydown)");

            if (event.key === 'Shift') {
                keyModifierStates.shift = true;
                console.warn("Shift pressed");
                setEditOptions((prev) => ({ ...prev, mode: "move" }));
                return;
            } else if (event.key === 'Control') {
                keyModifierStates.control = true;
                console.warn("Control pressed");
                return;
            } else {
                if (event.ctrlKey || event.shiftKey) {
                    event.preventDefault();
                }
            }

            console.log("Called function for ", event.key);
            const keyCombination = `${event.ctrlKey ? 'Ctrl' : ''}${event.shiftKey ? 'Shift' : ''}${event.key}`;
            const func = keybinds?.[keyCombination];

            if (func) {
                func(complexEditor, setEditOptions, setViewOptions);
            }
        };

const handleKeyup =
    //(keyModifierStates: { shift: boolean, control: boolean }) =>
    (
        setEditOptions: React.Dispatch<React.SetStateAction<any>>,
        setViewOptions: React.Dispatch<React.SetStateAction<any>>,
        complexEditor: any,

    ) =>
        (event: KeyboardEvent) => {
            console.log("Successfuly using the new keybinding system (keyup)");
            if (event.repeat) {
                event.preventDefault();
                event.stopPropagation();
                return;
            };
            if (event.key === 'Shift') {
                setEditOptions((prev) => ({ ...prev, mode: "select" }));
                keyModifierStates.shift = false;

            }
            if (event.key === 'Control') {
                keyModifierStates.control = false;
            }
        };

export const useKeybindings = (
    setEditOptions: React.Dispatch<React.SetStateAction<any>>,
    setViewOptions: React.Dispatch<React.SetStateAction<any>>,
    complexEditor: any,
    allowEditing: boolean
) => {
    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (!allowEditing) return;
            handleKeydown(setEditOptions, setViewOptions, complexEditor)(e);
        };

        const keyupHandler = (e: KeyboardEvent) => {
            if (!allowEditing) return;
            handleKeyup(setEditOptions, setViewOptions, complexEditor)(e);
        };
        window.addEventListener('keydown', keydownHandler);
        window.addEventListener('keyup', keyupHandler);
        
        return () => {
            window.removeEventListener('keydown', keydownHandler);
            window.removeEventListener('keyup', keyupHandler);
        };
    }, [setEditOptions, setViewOptions, complexEditor, allowEditing]);
}