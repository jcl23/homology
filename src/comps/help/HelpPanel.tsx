import { useContext, useState } from 'react';
import { FAQModal } from '../faq/FAQModal';
import styles from './HelpPanel.module.css';
import Joyride from 'react-joyride';
import { steps1} from '../../tutorial/steps';
import { useTutorial } from '../../tutorial/TutorialContext';
import MyTooltip from '../../tutorial/MyTooltip';
import { tutorialSteps } from '../../tutorial/tutorialSteps';

export const HelpPanel = () => {
    const { stepIndex, handleJoyrideCallback } = useTutorial();
    return (
        <div className={styles.panel}>
            {/* <FAQModal /> */}
            <h2 style={{ textAlign: 'center', marginBottom: '5em', marginTop: '0.2em', fontWeight: 'bold', color: "#444" }}>
            justin's Δ-complex editor
            </h2>
            <Joyride
              tooltipComponent={MyTooltip}
              steps={tutorialSteps}
              run={true}
              continuous={true}
              stepIndex={stepIndex}
              callback={handleJoyrideCallback}
              styles={{
                options: {
                  zIndex: 10000,
                },
              }}
            />
        </div>
    );
}