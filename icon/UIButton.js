import { jsxs as _jsxs } from "react/jsx-runtime";
import { useTheme } from '@mui/material/styles';
import styles from './UIButton.module.css';
const UIButton = ({ onClick, selected, children, name, startIcon = null, style = {} }) => {
    const theme = useTheme();
    const backgroundColor = `var(--${selected ? 'selected-bg' : 'unselected-bg'})`;
    return (_jsxs("button", { variant: "contained", onMouseDown: onClick, className: `${styles.button} ${selected ? styles.selected : styles.unselected}`, startIcon: startIcon, 
        // style={{
        //     fontWeight: 'bold',
        //     width: '55px', // Square button dimensions
        //     height: '55px',
        //     textTransform: 'none',
        //     minWidth: '0',
        //     margin: '5px',
        //     marginBottom: '5px',
        //     padding: '0px',
        //     border: `2px solid #0004`,
        //     bottomRightCornerRadius: "0px",
        //     position: 'relative', // Enable overlaying icons
        //     display: 'flex',
        //     flexDirection: 'column',
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //     color: `var(--${selected ? 'selected-fg' : 'unselected-fg'})`,
        //     backgroundColor,
        // }}
        style: {
            ...style,
            color: `var(--${selected ? 'selected-fg' : 'unselected-fg'})`,
            backgroundColor,
        }, children: [children, name] }));
};
export default UIButton;
