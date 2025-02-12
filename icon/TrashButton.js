import { jsx as _jsx } from "react/jsx-runtime";
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../style/theme";
import styles from "./UIButton.module.css";
import UIButton from "./UIButton";
export default function ({ selected, onClick }) {
    // const { background, foreground} = theme.palette.button[active ? 'selected' : 'unselected'];
    const { foreground, background } = theme.palette.button?.[selected ? 'selected' : 'unselected'];
    return (_jsx(UIButton
    //backgroundColor={(( theme.palette as any).button?.[(mode == "select") ? 'selected' : 'unselected'].background, "#CCC")} // Color based on state
    , { 
        //backgroundColor={(( theme.palette as any).button?.[(mode == "select") ? 'selected' : 'unselected'].background, "#CCC")} // Color based on state
        color: foreground, name: "remove", onClick: onClick, 
        // className={mode === "select" ? styles.selected : ""}
        selected: selected, children: _jsx(DeleteIcon, { className: styles.icon, fontSize: "large", sx: { color: foreground } }) }));
}
