import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from "./DebugComplex.module.css";
const boxSize = 12;
const DebugComplex = ({ complex }) => {
    // get the maximum index for each dimension
    const getMaxIndex = (cells) => cells.length > 0 ? Math.max(...cells.map((cell) => cell.index)) : -1;
    const getRepresentatives = (cells, index) => cells.filter((cell) => cell.index === index);
    return (_jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: Object.keys(complex.cells).map((dim) => {
            const dimension = parseInt(dim, 10);
            const cellsInDim = complex.cells[dimension];
            const maxIndex = getMaxIndex(cellsInDim);
            return (_jsx("div", { children: _jsx("div", { style: { display: "flex", gap: "2px" }, children: Array.from({ length: maxIndex + 1 }).map((_, index) => {
                        const representatives = getRepresentatives(cellsInDim, index);
                        const hasCells = representatives.length > 0;
                        return (_jsxs("div", { style: {
                                width: `${boxSize}px`,
                                height: `${boxSize}px`,
                                backgroundColor: hasCells ? "lightblue" : "lightgray",
                                border: "1px solid black",
                                position: "relative",
                                cursor: hasCells ? "pointer" : "default",
                                fontSize: "10px",
                            }, title: hasCells ? `Index ${index}` : "", children: [index, hasCells && (_jsx("div", { style: {
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        backgroundColor: "white",
                                        border: "1px solid gray",
                                        padding: "4px",
                                        fontSize: "10px",
                                        whiteSpace: "nowrap",
                                        zIndex: 10,
                                        visibility: "hidden",
                                    }, className: styles.tooltip, children: representatives.map((cell) => (_jsx("div", { children: cell.name || cell.id }, cell.id))) }))] }, index));
                    }) }) }, dimension));
        }) }));
};
export default DebugComplex;
