import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import styles from "./NotificationManager.module.css";
const NotificationManager = () => {
    const [notifications, setNotifications] = useState([]);
    const [sections, setSections] = useState(new Set());
    const [enabledSections, setEnabledSections] = useState(new Set());
    // Load enabled sections from localStorage on mount
    useEffect(() => {
        const savedSections = JSON.parse(localStorage.getItem("enabledSections") || "[]");
        setEnabledSections(new Set(savedSections));
    }, []);
    // Save enabled sections to localStorage when they change
    useEffect(() => {
        localStorage.setItem("enabledSections", JSON.stringify(Array.from(enabledSections)));
    }, [enabledSections]);
    const addNotification = (section, message) => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [{ id, section, message }, ...prev]);
        setSections((prev) => {
            if (!prev.has(section)) {
                setEnabledSections((prev) => new Set([...prev, section]));
            }
            return new Set([...prev, section]);
        }); // Add section dynamically
        setTimeout(() => {
            setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        }, 5000); // Notifications disappear after 5 seconds
    };
    // Define console.notify
    useEffect(() => {
        console.notify = (section, ...args) => {
            const message = args.map((arg) => String(arg)).join(", ");
            addNotification(section, message);
        };
    }, []);
    const handleRightClick = (e, section) => {
        e.preventDefault();
        setEnabledSections((prev) => {
            const newSet = new Set(prev);
            newSet.delete(section); // Disable section on right-click
            return newSet;
        });
    };
    const toggleSection = (section) => {
        setEnabledSections((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            }
            else {
                newSet.add(section);
            }
            return newSet;
        });
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.menu, children: _jsxs("details", { children: [_jsx("summary", { children: "Notification Settings" }), Array.from(sections).map((section) => (_jsx("div", { children: _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: enabledSections.has(section), onChange: () => toggleSection(section) }), section] }) }, section)))] }) }), _jsx("div", { className: styles.notificationContainer, children: notifications
                    .filter((notif) => enabledSections.has(notif.section))
                    .map((notif) => (_jsxs("div", { className: styles.notification, onContextMenu: (e) => handleRightClick(e, notif.section), children: [_jsxs("strong", { children: ["[", notif.section, "]"] }), " ", notif.message] }, notif.id))) })] }));
};
export default NotificationManager;
