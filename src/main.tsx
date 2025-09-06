import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import MobileApp from './MobileApp'
import './index.css'

const isMobile = window.innerWidth < 768;
createRoot(document.getElementById('root')!).render(
  <Fragment>
    {isMobile ? <MobileApp /> : <App />}
  </Fragment>,
)
