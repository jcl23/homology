import { AbstractCell } from "./CWComplex";

export type SelectedState = "verticesOnly" | "none" | "other" | "edgesOnly" | "facesOnly";

export const classifySelected = (selected: Set<string>): SelectedState => {
    const selectedList = [...selected];
    const selectedVertexReps = new Set(selectedList.filter((cell) => cell.dimension === 0));
    const selectedEdgeReps = new Set(selectedList.filter((cell) => cell.dimension === 1));
    const selectedFaceReps = new Set(selectedList.filter((cell) => cell.dimension === 2));

    const noneSelected = selectedList.length === 0;
    const onlyVerticesSelected = selectedVertexReps.size > 0 && selectedEdgeReps.size === 0 && selectedFaceReps.size === 0;
    const onlyEdgesSelected = selectedVertexReps.size === 0 && selectedEdgeReps.size > 0 && selectedFaceReps.size === 0;
    const onlyFacesSelected = selectedVertexReps.size === 0 && selectedEdgeReps.size === 0 && selectedFaceReps.size > 0;
    return (
        noneSelected ? "none"
        : onlyVerticesSelected ? "verticesOnly"
        : onlyEdgesSelected ? "edgesOnly"
        : onlyFacesSelected ? "facesOnly"
        : "other"
    );
}