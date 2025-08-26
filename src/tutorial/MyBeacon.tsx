import { forwardRef } from 'react';
import Joyride, { BeaconRenderProps } from 'react-joyride';
import { keyframes } from '@emotion/react';
import styles from "./Tutorial.module.css"

const MyBeacon = forwardRef<HTMLButtonElement, BeaconRenderProps>((props, ref) => {
  return <button 
    className={styles.beacon} 
    // ref={ref} 
    
    {...props}>
      Enter Tutorial
    </button>;
});

export default MyBeacon;