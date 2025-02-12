import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import styles from "./LoadComplex.module.css";
import { complexes } from "../../data/presets";
import { FolderOpen } from "@mui/icons-material";
export const LoadComplex = function ({ setPreset,
// defaultComplexes 
 }) {
    // list available complexes
    const [showModal, setShowModal] = useState(false);
    const wholeModal = (_jsx("div", { className: styles.background, children: _jsxs("div", { className: styles.modalWindow, children: [_jsxs("div", { className: styles.modalHeader, children: [_jsx("h2", { children: "Load Complex" }), _jsx("button", { className: styles.closeModal, onClick: () => { setShowModal(false); console.warn("test"); }, children: "Close" })] }), _jsx("ul", { className: styles.list, children: Object.values(complexes).map((preset) => (_jsx("li", { onClick: () => { setPreset(preset); }, children: preset.name }))) })] }) }));
    return (_jsxs(_Fragment, { children: [_jsx("button", { className: styles.button, onClick: () => { setShowModal(true); }, children: _jsxs("div", { children: [_jsx("div", { style: { marginLeft: "3px" }, children: _jsx(FolderOpen, {}) }), "load"] }) }), showModal && wholeModal] }));
};
