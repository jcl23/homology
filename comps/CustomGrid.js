import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Line } from "@react-three/drei";
// TODO extend this to make it possible to be hexagonal!
const CustomGrid = ({ gridSize, gridExtent }) => {
    const lines = [];
    for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
        lines.push([
            [-gridExtent, 0, i],
            [gridExtent, 0, i],
        ]);
        lines.push([
            [i, 0, -gridExtent],
            [i, 0, gridExtent],
        ]);
    }
    return (_jsx(_Fragment, { children: lines.map((line, index) => (_jsx(Line, { points: line, color: "lightgray", lineWidth: 1 }, index))) }));
};
export default CustomGrid;
