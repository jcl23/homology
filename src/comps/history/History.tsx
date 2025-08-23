import { CWComplexStateEditor, EditorState } from "../../hooks/useCWComplexEditor";
import { CWComplexEditStep, EditType } from "../../logic/steps";
import styles from "./History.module.css";
type HistoryProps = {
    editorState: EditorState;
    complexEditor: CWComplexStateEditor;
}

type HistoryGroup = {
    type: EditType;
    steps: CWComplexEditStep[];
}

const groupHistory = (editorState: EditorState): HistoryGroup[] => {
    const history: HistoryGroup[] = [];
    let currentGroup: HistoryGroup = { type: "start", steps: [editorState.history[0]] };
    for (const step of editorState.history.slice(1)) {
        if (step.type === currentGroup.type) {
            currentGroup.steps.push(step);
        } else {
            history.push(currentGroup);
            currentGroup = { type: step.type, steps: [step] };
        }
    }
    history.push(currentGroup);
    return history;
}
const HistoryGroup = ({ group, index }: { group: HistoryGroup, index: number }) => {
    // display the type, and ONLY if more than 1 in group, "x{num}"
    if (group.steps.length === 1) {
        return (
            <div className={styles.historyItem} key={`history-group-${index}`}>
                {group.type}
            </div>
        )
    }
    return (
        <div className={styles.historyItem} key={`history-group-${index}`}>
            {group.type} x{group.steps.length}
            
        </div>
    )
}
const History = ({ complexEditor }: HistoryProps) => {
    type StepBlock = {
        type: EditType;
        steps: CWComplexEditStep[];
    }
    const groupedHistory = groupHistory(complexEditor.editorState);
    return (
        <div className={styles.historyOuter}>
            {groupedHistory.map((group, i) => (
                <HistoryGroup group={group} index={i} />
            ))}
        </div>
    );

};

export default History;