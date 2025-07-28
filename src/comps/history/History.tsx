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
const HistoryGroup = ({ group }: { group: HistoryGroup }) => {
    // display the type, and ONLY if more than 1 in group, "x{num}"
    if (group.steps.length === 1) {
        return (
            <div className={styles.historyItem}>
                {group.type}
            </div>
        )
    }
    return (
        <div className={styles.historyItem}>
            {group.type} x{group.steps.length}
            
        </div>
    )
}
const History = ({ editorState, complexEditor }: HistoryProps) => {
    type StepBlock = {
        type: EditType;
        steps: CWComplexEditStep[];
    }
    const groupedHistory = groupHistory(editorState);
    return (
        <div className={styles.historyOuter}>
            {groupedHistory.map((group, i) => (
                <HistoryGroup group={group} />
            ))}
        </div>
    );
    return (
        <div className={styles.historyOuter}>
            {editorState.history.map((step, i) => {
                const { type } = step;
                return (
                    <div onClick={() => complexEditor.jumpToStep(i)} className={styles.historyItem}>
                        {type}
                    </div>
                )
            })}
      </div>
    );
};

export default History;