import { CssBaseline, Icon, ThemeProvider } from "@mui/material";
import theme from "../style/theme";
import UIButton from "./UIButton";
import { RedoOutlined, Undo } from "@mui/icons-material";

type RedoIconProps = {
    enabled: boolean;
};

export default function RedoIcon({ enabled }: RedoIconProps) {
    // Customize later
    return (
        <RedoOutlined  />
    );
}
