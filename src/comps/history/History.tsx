import { CWComplexStateEditor, EditorState } from "../../hooks/useCWComplexEditor";
import { CWComplexEditStep, EditType } from "../../logic/steps";
import styles from "./History.module.css";
type HistoryProps = {
    editorState: EditorState;
    freezeIndex: number; // if >= 0, then disable editing past this index`
    complexEditor: CWComplexStateEditor;
}

type HistoryGroup = {
    type: EditType;
    steps: CWComplexEditStep[];
    index;
}

const groupHistory = (editorState: EditorState): HistoryGroup[] => {
    const history: HistoryGroup[] = [];
    let currentGroup: HistoryGroup = { type: "start", steps: [editorState.history[0]], index: 0};
    let currentGroupStartIndex = 0;
    for (let i = 1; i < editorState.history.length; i++) {
        const step = editorState.history[i];
        if (step.type === currentGroup.type) {
            currentGroup.steps.push(step);
        } else {
            history.push(currentGroup);
            currentGroup = { type: step.type, steps: [step], index: i  };
        }
    }
    history.push(currentGroup);
    return history;
}
type HistoryGroupProps = {
    group: HistoryGroup;
    index: number;
    goToStep: () => void;
    disable: boolean;
}
const HistoryGroup = ({ group, index, goToStep, disable }: HistoryGroupProps) => {
    // display the type, and ONLY if more than 1 in group, "x{num}"

    const str = (group.steps.length === 1) ? group.type : `${group.type} x${group.steps.length}`
    return (
        <div className={(disable ? styles.disabled : "") + " " + styles.historyItem } key={`history-group-${index}`} onClick={disable ? () => {} : goToStep}>
            {str}            
        </div>
    )
}
const History = ({ complexEditor, freezeIndex }: HistoryProps) => {
    type StepBlock = {
        type: EditType;
        steps: CWComplexEditStep[];
    }
    const groupedHistory = groupHistory(complexEditor.editorState);
    return (
        <div className={styles.historyOuter}>
            {groupedHistory.map((group, i) => (
                <><HistoryGroup disable={group.index < freezeIndex} group={group} index={i} goToStep={() => complexEditor.goBackTo(group.index)} /></>
            ))}
        </div>
    );

};

export default History;