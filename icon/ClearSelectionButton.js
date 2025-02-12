import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "../style/theme";
import styles from "../icon/Buttons.module.css";
import UIButton from "./UIButton";
export default function ClearSelectionButton({ enabled, onClick }) {
    const { foreground, background } = theme.palette.button?.unselected;
    return (_jsxs(ThemeProvider, { theme: theme, children: [_jsx(CssBaseline, {}), _jsx(UIButton, { selected: false, onClick: onClick, className: styles.button, children: _jsx("div", { style: {
                        width: "20px",
                        height: "20px",
                        border: "1px dashed black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }, children: _jsxs("div", { style: {
                            width: "14px",
                            height: "14px",
                            position: "relative"
                        }, children: [_jsx("div", { style: {
                                    position: "absolute",
                                    width: "100%",
                                    height: "2px",
                                    backgroundColor: "black",
                                    transform: "rotate(45deg)"
                                } }), _jsx("div", { style: {
                                    position: "absolute",
                                    width: "100%",
                                    height: "2px",
                                    backgroundColor: "black",
                                    transform: "rotate(-45deg)"
                                } })] }) }) })] }));
}
