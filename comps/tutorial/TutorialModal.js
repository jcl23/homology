import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from './TutorialModal.module.css';
const TutorialModal = () => {
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const hideTutorial = localStorage.getItem('hideTutorial');
        if (!hideTutorial)
            setShowModal(true);
    }, []);
    const handleStartTutorial = () => {
        setShowModal(false);
        // Start the tutorial logic
    };
    const handleCloseModal = () => {
        setShowModal(false);
        localStorage.setItem('hideTutorial', 'true'); // Remember user's preference
    };
    if (!showModal)
        return null;
    return (_jsx("div", { className: styles.modal, children: _jsxs("div", { className: "modal-content", children: [_jsx("h2", { children: "Welcome!" }), _jsx("p", { children: "Would you like to take a tutorial to learn how to use the app?" }), _jsx("button", { onClick: handleStartTutorial, children: "Start Tutorial" }), _jsx("button", { onClick: handleCloseModal, children: "Don't Show Again" })] }) }));
};
export default TutorialModal;
