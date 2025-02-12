import { jsx as _jsx } from "react/jsx-runtime";
import { Html } from "@react-three/drei";
const Label = ({ position, text }) => {
    return (_jsx(Html, { position: position, zIndexRange: [100, 200], style: { pointerEvents: 'none' }, children: _jsx("div", { style: { color: 'black', fontSize: '12px', background: '#FFF9', border: "1px solid black", padding: '2px', borderRadius: '3px', pointerEvents: 'none' }, children: text }) }));
};
export default Label;
