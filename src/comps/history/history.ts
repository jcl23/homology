import { CWComplexEditStep } from "../../logic/steps";

export type History = CWComplexEditStep[];
const stepToJSON = (step: CWComplexEditStep): any => {
    const stepFunctionName = step.step.name;
}
export function historyToJSON(history: History): string {
    return JSON.stringify(history, (key, value) => {
        if (value instanceof Set) {
            return Array.from(value);
        }
        return value;
    });
}