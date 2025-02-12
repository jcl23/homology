import { jsx as _jsx } from "react/jsx-runtime";
import theme from "../style/theme";
import { PointerIcon } from "../assets/icons";
import UIButton from "./UIButton";
import TrashButton from "./TrashButton";
import VertexAddButton from "./VertexAddButton";
import MoveButton from "./MoveButton";
TrashButton;
VertexAddButton;
MoveButton;
export default function ({ selected, onClick }) {
    // const { background, foreground} = theme.palette.button[active ? 'selected' : 'unselected'];
    const { foreground, background } = theme.palette.button?.[selected ? 'selected' : 'unselected'];
    return (_jsx(UIButton, { selected: selected, name: "select", onClick: onClick, children: _jsx(PointerIcon, { color: foreground }) }));
}
