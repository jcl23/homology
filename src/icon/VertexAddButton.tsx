import React, { useState } from 'react';
import { Button } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '../style/theme';
import { Circle, RadioButtonChecked } from '@mui/icons-material';
import UIButton from './UIButton';
import SelectButton from './SelectButton';
import TrashButton from './TrashButton';



type VertexAddbuttonProps = {
  selected: boolean;
  onClick: () => void;
}


// links:
SelectButton; TrashButton; VertexAddButton; 



function VertexAddButton({ selected, onClick } : VertexAddbuttonProps) {
  //const [hovered, setHovered] = useState(false);
  const bstyles = theme.palette?.["button"];
  const plusColor = bstyles?.[selected ? 'selected' : 'unselected'].foreground;
  return (


      <UIButton
        selected={selected}
        onClick={onClick}
        name="add"
        // onMouseEnter={() => setHovered(true)}
        // onMouseLeave={() => setHovered(false)}

      >
        {/* Circle icon as background */}
        <Circle
          style={{
            fontSize: '24px',
            marginTop: "9px",
            marginRight: "6px",
            color: `var(--${selected ? 'selected-fg' : 'unselected-fg'})`,
          }} 
        />
        {/* Plus icon overlaid in the center */}
        <div style={{position: "absolute", left: "28px", bottom: "48px"}}>
          <div style={{position: "absolute", top: "5px", width: "14px", height: "4px", backgroundColor: plusColor, transition: "backgroundColor 0.2s ease-in-out"}} />
          <div style={{position: "absolute", left: "5px", width: "4px", height: "14px", backgroundColor: plusColor}} />
        </div>
      </UIButton>

  );
}

export default VertexAddButton;
