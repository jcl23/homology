import { useContext, useState } from 'react';
import { FAQModal } from '../faq/FAQModal';
import styles from './HelpPanel.module.css';
import Joyride from 'react-joyride';
import steps from '../../tutorial/steps';
import { useTutorial } from '../../tutorial/TutorialContext';

export const HelpPanel = () => {
    const { stepIndex, handleJoyrideCallback } = useTutorial();
    return (
        <div className={styles.panel}>
            {/* <FAQModal /> */}
            <Joyride
              steps={steps}
              run={true}
              stepIndex={stepIndex}
              callback={handleJoyrideCallback}
              continuous={true}
              showSkipButton={true}
              showProgress={true}
              styles={{
                options: {
                  zIndex: 10000,
                },
              }}
            />
        </div>
    );
}