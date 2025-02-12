import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./History.module.css";
const groupHistory = (editorState) => {
    const history = [];
    let currentGroup = { type: "start", steps: [editorState.history[0]] };
    for (const step of editorState.history.slice(1)) {
        if (step.type === currentGroup.type) {
            currentGroup.steps.push(step);
        }
        else {
            history.push(currentGroup);
            currentGroup = { type: step.type, steps: [step] };
        }
    }
    history.push(currentGroup);
    return history;
};
const HistoryGroup = ({ group }) => {
    // display the type, and ONLY if more than 1 in group, "x{num}"
    if (group.steps.length === 1) {
        return (_jsx("div", { className: styles.historyItem, children: group.type }));
    }
    return (_jsxs("div", { className: styles.historyItem, children: [group.type, " x", group.steps.length] }));
};
const History = ({ editorState, complexEditor }) => {
    const groupedHistory = groupHistory(editorState);
    return (_jsx("div", { className: styles.historyOuter, children: groupedHistory.map((group, i) => (_jsx(HistoryGroup, { group: group }))) }));
    a;
    return (_jsx("div", { className: styles.historyOuter, children: editorState.history.map((step, i) => {
            const { type } = step;
            return (_jsx("div", { onClick: () => complexEditor.jumpToStep(i), className: styles.historyItem, children: type }));
        }) }));
};
export default History;
