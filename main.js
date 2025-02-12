import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
createRoot(document.getElementById('root')).render(_jsx(Fragment, { children: _jsx(App, {}) }));
