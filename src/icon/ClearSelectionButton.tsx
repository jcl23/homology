import { Button, CssBaseline, Icon, ThemeProvider } from "@mui/material";
import theme from "../style/theme";
import { PointerIcon } from "../assets/icons";
import styles from "../icon/Buttons.module.css";
import UIButton from "./UIButton";

type ClearSelectionButtonProps = {
    enabled: boolean;
    onClick: () => void;
};

export default function ClearSelectionButton({ enabled, onClick }: ClearSelectionButtonProps) {
    const { foreground, background } = (theme.palette as any).button?.unselected;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <UIButton
                selected={false}
                onClick={onClick}
                className={styles.button}
            >
                <div style={{
                    width: "20px",
                    height: "20px",
                    border: "1px dashed black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div style={{
                        width: "14px",
                        height: "14px",
                        position: "relative"
                    }}>
                        <div style={{
                            position: "absolute",
                            width: "100%",
                            height: "2px",
                            backgroundColor: "black",
                            transform: "rotate(45deg)"
                        }}></div>
                        <div style={{
                            position: "absolute",
                            width: "100%",
                            height: "2px",
                            backgroundColor: "black",
                            transform: "rotate(-45deg)"
                        }}></div>
                    </div>
                </div>
            </UIButton>
        </ThemeProvider>
    );
}