import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import styles from './SimplicesPanel.module.css';
const SimplexData = ({ selected, cell, toggleCellSelection }) => {
    const [expanded, setExpanded] = useState(false);
    const numLines = 1;
    const expandedHeight = `${numLines * 20}px`;
    const height = expanded ? expandedHeight : "0px";
    return (_jsxs("div", { className: styles.datumOuter, children: [_jsxs("div", { className: `${styles.cellHeader} ${styles[selected ? "selected" : "unselected"]}`, onClick: () => toggleCellSelection(cell), children: [_jsx("div", { children: cell.name }), _jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [_jsxs("div", { children: ["id=", cell.id] }), _jsx("button", { className: styles.expandButton, onClick: (e) => {
                                    e.stopPropagation();
                                    setExpanded(current => !current);
                                }, children: expanded ? "-" : "+" })] })] }), _jsxs("div", { className: `${styles.cellData} ${expanded ? styles.expandedData : ""}`, style: { maxHeight: height }, onClick: () => toggleCellSelection(cell), children: [_jsx("div", { children: cell.attachingMap.map(c => c.name).join(", ") }), _jsx("div", { children: cell.cob.map(c => c.name).join(", ") })] })] }));
    return (_jsxs(_Fragment, { children: [_jsxs("tr", { className: `simplexData ${selected ? "selected" : ""}`, onClick: () => toggleCellSelection(cell), children: [_jsx("td", { children: cell.name }), _jsx("td", { children: cell.index }), _jsx("td", { children: cell.dimension }), _jsx("td", { children: _jsx("button", { onClick: () => setExpanded(false), children: "-" }) })] }), _jsx("tr", { className: `simplexData ${selected ? "selected" : ""}`, onClick: () => toggleCellSelection(cell), children: _jsx("td", { children: cell.cob.map(c => c.name).join(", ") }) })] }));
};
export default SimplexData;
