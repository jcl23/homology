import { jsx as _jsx } from "react/jsx-runtime";
import theme from "../style/theme";
import { MoveIcon } from "../assets/icons";
import UIButton from "./UIButton";
export default function ({ selected, onClick }) {
    // const { background, foreground} = theme.palette.button[active ? 'selected' : 'unselected'];
    const { foreground, background } = theme.palette.button?.[selected ? 'selected' : 'unselected'];
    return (_jsx(UIButton
    //backgroundColor={(( theme.palette as any).button?.[(mode == "select") ? 'selected' : 'unselected'].background, "#CCC")} // Color based on state
    , { 
        //backgroundColor={(( theme.palette as any).button?.[(mode == "select") ? 'selected' : 'unselected'].background, "#CCC")} // Color based on state
        selected: selected, onClick: onClick, name: "move", children: _jsx(MoveIcon, { color: foreground }) }));
}
