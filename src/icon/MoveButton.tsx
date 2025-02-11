import { Button, CssBaseline, Icon, ThemeProvider } from "@mui/material"

import theme from "../style/theme"
import { PointerIcon, MoveIcon } from "../assets/icons";
import UIButton from "./UIButton";

type MoveButtonProps = {
    selected: boolean;
    onClick: () => void;
  }
  
export default function({ selected, onClick }: MoveButtonProps) {

    // const { background, foreground} = theme.palette.button[active ? 'selected' : 'unselected'];

    const { foreground, background } = (theme.palette as any).button?.[selected ? 'selected' : 'unselected'];
    return (

        <UIButton
            //backgroundColor={(( theme.palette as any).button?.[(mode == "select") ? 'selected' : 'unselected'].background, "#CCC")} // Color based on state
            selected={selected}
            onClick={onClick}
            name={"move"}
            // className={mode === "select" ? styles.selected : ""}
        >
          <MoveIcon color={foreground} />
        </UIButton>

    )
}