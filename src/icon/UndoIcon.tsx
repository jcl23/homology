import { CssBaseline, Icon, ThemeProvider } from "@mui/material";
import theme from "../style/theme";
import UIButton from "./UIButton";
import { Undo, UndoOutlined, UndoTwoTone } from "@mui/icons-material";

type UndoIconProps = {
    enabled: boolean;
};

export default function UndoIcon({ enabled }: UndoIconProps) {
    // Customize later
    return (
        <div style={{
            
            marginTop: "4px",
            marginBottom: "2px",
            transform: "scale(1.15)",
        }}>
            <UndoOutlined width="20"/>
        </div>
    );
}
