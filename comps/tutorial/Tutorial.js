import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Joyride from 'react-joyride';
const Tutorial = () => {
    const [run, setRun] = useState(false);
    const steps = [
        {
            target: '.settings-button',
            content: 'Click here to access your settings!',
        },
        {
            target: '.canvas-container',
            content: 'This is your 3D editor. Use the mouse to pan, zoom, and rotate.',
        },
        {
            target: '.help-button',
            content: 'Need more help? Click here anytime.',
        },
    ];
    const startTutorial = () => {
        setRun(true);
    };
    return (_jsxs("div", { children: [_jsx("button", { onClick: startTutorial, children: "Start Tutorial" }), _jsx(Joyride, { steps: steps, run: run, continuous: true, showProgress: true, showSkipButton: true, styles: {
                    options: {
                        zIndex: 10000,
                    },
                } })] }));
};
export default Tutorial;
