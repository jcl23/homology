import React, { useState, useEffect } from "react";
import styles from "./NotificationManager.module.css";

interface Notification {
  id: number;
  section: string;
  message: string;
}

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sections, setSections] = useState<Set<string>>(new Set());
  const [enabledSections, setEnabledSections] = useState<Set<string>>(new Set());

  // Load enabled sections from localStorage on mount
  useEffect(() => {
    const savedSections = JSON.parse(localStorage.getItem("enabledSections") || "[]");
    setEnabledSections(new Set(savedSections));
  }, []);

  // Save enabled sections to localStorage when they change
  useEffect(() => {
    localStorage.setItem("enabledSections", JSON.stringify(Array.from(enabledSections)));
  }, [enabledSections]);

  const addNotification = (section: string, message: string) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [{ id, section, message }, ...prev]);
    setSections((prev) => {
        if (!prev.has(section)) {
            setEnabledSections((prev) => new Set([...prev, section]));
        }
        return new Set([...prev, section])
    }); // Add section dynamically
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 5000); // Notifications disappear after 5 seconds
  };

  // Define console.notify
  useEffect(() => {
    console.notify = (section: string, ...args: unknown[]) => {
      const message = args.map((arg) => String(arg)).join(", ");
      addNotification(section, message);
    };
  }, []);

  const handleRightClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    setEnabledSections((prev) => {
      const newSet = new Set(prev);
      newSet.delete(section); // Disable section on right-click
      return newSet;
    });
  };

  const toggleSection = (section: string) => {
    setEnabledSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Expandable Menu */}
      <div className={styles.menu}>
        <details>
          <summary>Notification Settings</summary>
          {Array.from(sections).map((section) => (
            <div key={section}>
              <label>
                <input
                  type="checkbox"
                  checked={enabledSections.has(section)}
                  onChange={() => toggleSection(section)}
                />
                {section}
              </label>
            </div>
          ))}
        </details>
      </div>

      {/* Notification Container */}
      <div className={styles.notificationContainer}>
        {notifications
          .filter((notif) => enabledSections.has(notif.section))
          .map((notif) => (
            <div
              key={notif.id}
              className={styles.notification}
              onContextMenu={(e) => handleRightClick(e, notif.section)}
            >
              <strong>[{notif.section}]</strong> {notif.message}
            </div>
          ))}
      </div>
    </>
  );
};

// Extend console to include notify
declare global {
  interface Console {
    notify(section: string, ...args: unknown[]): void;
  }
}

export default NotificationManager;
