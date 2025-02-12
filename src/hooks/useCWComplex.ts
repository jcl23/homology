// // a hook for the CWComplex state. 


// import { useEffect, useState } from 'react';
// import { AbstractCell, CWComplex } from '../math/CWComplex';

// export type UseCWComplexReturn = {
//     complex: CWComplex;
//     setComplex: React.Dispatch<React.SetStateAction<CWComplex>>;
//     selectionKey: "index" | "id";
//     setSelectionKey: React.Dispatch<React.SetStateAction<"index" | "id">>;
//     selectedCells: Set<number>[];
//     selectedReps: Set<AbstractCell>;
//     selectRep: (cell: AbstractCell) => void;
//     unselectRep: (cell: AbstractCell) => void;
//     toggleRepSelection: (cell: AbstractCell) => void;
//     isRepSelected: (cell: AbstractCell) => boolean;
//     attachCell: (cell: AbstractCell) => void;
//     performActionOnSelectedReps: (action: (cell: AbstractCell) => void) => void;
//     unselectAll: () => void;
// };

// export function useCWComplex(initialComplex: CWComplex): UseCWComplexReturn {
//     const [complex, setComplex] = useState<CWComplex>(initialComplex);
//     const [selectionKey, setSelectionKey] = useState<"index" | "id">("index");
//     const [selectedCells, setSelectedCells] = useState<Set<number>[]>([new Set(), new Set(), new Set(), new Set()]);
//     const [selectedReps, setSelectedReps] = useState<Set<AbstractCell>>(new Set());
//     //put on a new cell, select a cell, unselect a cell, toggle selection, identify cells, perform action on selected cells
//     // should feel like "editing"
//     // UPDATE Depracating this for an explicit edit state thing 
//     useEffect(() => {
//         if (selectionKey === "index") {
//             // update reps by cells (pullback)
//             const newReps = new Set<AbstractCell>();
//             [0, 1, 2, 3].map(i => complex.cells[i]).forEach(cells => {
//                 cells.forEach(cell => {
//                     if (selectedCells[cell.dimension].has(cell.index)) {
//                         newReps.add(cell);
//                     }
//                 });
//             });
//             setSelectedReps(newReps);
//         }
//     }, [selectedCells]);

//     useEffect(() => {
//         if (selectionKey === "id") {
//             // update cells by reps (pushforward)
//             const newCells: Set<number>[] = [new Set(), new Set(), new Set(), new Set()];
//             selectedReps.forEach(cell => {
//                 newCells[cell.dimension].add(cell.index);
//             });
//             setSelectedCells(newCells);
//         }
//     }, [selectedReps]);
    
//     const attachCell = (cell: AbstractCell) => {
//         const newComplex = { ...complex };
//         newComplex.cells[cell.dimension].push(cell);
//         setComplex(newComplex);
//     };

//     // Function to select a cell
//     const selectRep = (cell: AbstractCell) => {
//         if (selectionKey === "id") {
//             setSelectedReps(prevSelected => {
//                 return new Set([...prevSelected, cell]);
//             });
//         } else {
//             setSelectedCells(prevSelected => {
//                 const newSelected = [...prevSelected];
//                 newSelected[cell.dimension].add(cell.index);
//                 return newSelected;
//             });
//         }
//     };

//     // Function to unselect a cell representative
//     const unselectRep =  (cell: AbstractCell) => {
//         if (selectionKey === "id") {
//             setSelectedReps(prevSelected => {
//                 const newSelected = new Set(prevSelected);
//                 newSelected.delete(cell);
//                 return newSelected;
//             });
//         } else {
//             setSelectedCells(prevSelected => {
//                 const newSelected = [...prevSelected];
//                 newSelected[cell.dimension].delete(cell.index);
//                 return newSelected;
//             });
//         }
//     }

//     // Function to toggle the selection of a cell
//     const toggleRepSelection = (cell: AbstractCell) => {
//         if (isRepSelected(cell)) {
//             unselectRep(cell);
//         } else {
//             selectRep(cell);
//         }
//     };

//     // Function to check if a cell is selected
//     const isRepSelected = (cell: AbstractCell) => {
//         if (selectionKey === "id") {
//             return selectedReps.has(cell);
//         } else {
//             return selectedCells[cell.dimension].has(cell.index);
//         }
//     }

//     // Function to perform an action on selected cells
//     const performActionOnSelectedReps = (action: (cell: AbstractCell) => void) => {
//         selectedCells.forEach((selected, dim) => {
//             selected.forEach(index => {
//                 action(complex.cells[dim][index]);
//             });
//         });
//     };

//     const unselectAll = () => {
//         setSelectedCells([new Set(), new Set(), new Set(), new Set()]);
//         setSelectedReps(new Set());
//     };


//     return {
//         complex,
//         setComplex,
//         selectRep,
//         selectedCells,
//         selectedReps,
//         selectionKey,
//         setSelectionKey,
//         unselectRep,
//         toggleRepSelection,
//         isRepSelected,
//         attachCell,
//         performActionOnSelectedReps,
//         unselectAll
//     };
// }