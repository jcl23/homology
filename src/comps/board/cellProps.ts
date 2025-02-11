import { AbstractCell } from "../../math/classes/cells";
import { DragSelectData } from "./Scene";

export type CellsProps = {
    selectedReps: AbstractCell[];
    toggleRepSelection: (key: string) => void;
    showName: boolean;
    setDragSelectData: React.Dispatch<React.SetStateAction<DragSelectData>>
    dragSelectData: DragSelectData;
    mode: string;
}