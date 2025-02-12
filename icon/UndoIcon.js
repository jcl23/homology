import { jsx as _jsx } from "react/jsx-runtime";
import { UndoOutlined } from "@mui/icons-material";
export default function UndoIcon({ enabled }) {
    // Customize later
    return (_jsx("div", { style: {
            marginTop: "4px",
            marginBottom: "2px",
            transform: "scale(1.15)",
        }, children: _jsx(UndoOutlined, { width: "20" }) }));
}
