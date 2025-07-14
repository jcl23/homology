import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { shaderMaterial } from '@react-three/drei';

interface UIButtonProps {
    onClick: () => void;
    selected: boolean;
    children?: React.ReactNode;
    startIcon?: JSX.Element;
    name: string;
    style?: React.CSSProperties;
}

import styles from './UIButton.module.css';

const UIButton: React.FC<UIButtonProps> = ({ onClick, selected, children, name, startIcon = null, style = {}}) => {
    const theme = useTheme();
    const backgroundColor = `var(--${selected ? 'selected-bg' : 'unselected-bg'})`;
    return (
        <button
   
            onMouseDown={onClick}
            className={`${styles.button} ${selected ? styles.selected : styles.unselected}`}
      

            style={{
                ...style,
                color: `var(--${selected ? 'selected-fg' : 'unselected-fg'})`,
                backgroundColor,
            }}
        >
            {children}
            {name}
            {/* <div style={{position: "absolute", bottom: "4px", width: "100%", borderStyle: "solid", borderWidth: "0px 0px 1px 0px"}}>
            </div> */}
        </button>
    );
};

export default UIButton;

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
//     justifyContent: 'flex-start',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: `var(--${selected ? 'selected-fg' : 'unselected-fg'})`,
//     backgroundColor,
// }}