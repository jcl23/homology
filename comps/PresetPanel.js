import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import styles from './PresetPanel.module.css';
export default function PresetPanel({ setComplex }) {
    return (_jsxs("div", { className: styles.PresetPanel, children: ["PresetPanel", _jsx("div", { style: { display: "flex", flexDirection: "row" }, children: [0, 1, 2].map((dim) => (_jsxs("button", { children: [dim, "D"] }, dim))) })] }));
}
