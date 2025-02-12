import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import theme from '../style/theme';
import { Circle } from '@mui/icons-material';
import UIButton from './UIButton';
import SelectButton from './SelectButton';
import TrashButton from './TrashButton';
// links:
SelectButton;
TrashButton;
VertexAddButton;
function VertexAddButton({ selected, onClick }) {
    //const [hovered, setHovered] = useState(false);
    const bstyles = theme.palette?.["button"];
    const plusColor = bstyles?.[selected ? 'selected' : 'unselected'].foreground;
    return (_jsxs(UIButton, { selected: selected, onClick: onClick, name: "add", children: [_jsx(Circle, { style: {
                    fontSize: '24px',
                    marginTop: "9px",
                    marginRight: "6px",
                    color: `var(--${selected ? 'selected-fg' : 'unselected-fg'})`,
                } }), _jsxs("div", { style: { position: "absolute", left: "28px", bottom: "48px" }, children: [_jsx("div", { style: { position: "absolute", top: "5px", width: "14px", height: "4px", backgroundColor: plusColor, transition: "backgroundColor 0.2s ease-in-out" } }), _jsx("div", { style: { position: "absolute", left: "5px", width: "4px", height: "14px", backgroundColor: plusColor } })] })] }));
}
export default VertexAddButton;
