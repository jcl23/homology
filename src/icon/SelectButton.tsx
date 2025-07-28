import { Button, CssBaseline, Icon, ThemeProvider } from "@mui/material"

import theme from "../style/theme"
import { PointerIcon } from "../assets/icons";
import styles from "../icon/Buttons.module.css";
import UIButton from "./UIButton";
import TrashButton from "./TrashButton";
import VertexAddButton from "./VertexAddButton";
import MoveButton from "./MoveButton";
type SelectButtonProps = {
    selected: boolean;
    onClick: () => void;
  }

  TrashButton; VertexAddButton; MoveButton;
  
export default function({ selected, onClick }: SelectButtonProps) {

    // const { background, foreground} = theme.palette.button[active ? 'selected' : 'unselected'];

    const { foreground, background } = (theme.palette as any).button?.[selected ? 'selected' : 'unselected'];
    return (

        <UIButton
          selected={selected}
          name={"select"}  
          onClick={onClick}
          // className={mode === "select" ? styles.selected : ""}
        >
          <PointerIcon  color={foreground}   />
        </UIButton>

    )
}