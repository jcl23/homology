import { Button, CssBaseline, Icon, ThemeProvider } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import theme from "../style/theme"
import styles from "./UIButton.module.css";
import UIButton from "./UIButton";

type TrashButtonProps = {
    selected: boolean;
    onClick: () => void;
}


export default function({ selected, onClick }: TrashButtonProps) {

    // const { background, foreground} = theme.palette.button[active ? 'selected' : 'unselected'];

    const { foreground, background } = (theme.palette as any).button?.[selected ? 'selected' : 'unselected'];

    return (

            <UIButton

                //backgroundColor={(( theme.palette as any).button?.[(mode == "select") ? 'selected' : 'unselected'].background, "#CCC")} // Color based on state
         
                name="remove"
                onClick={onClick}
                // className={mode === "select" ? styles.selected : ""}
                selected={selected}
            >
                <DeleteIcon className={styles.icon} fontSize="large" sx={{ color: foreground }} />
            </UIButton>
    )
}