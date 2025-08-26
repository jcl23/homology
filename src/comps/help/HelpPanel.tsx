import { useContext, useState } from 'react';
import { FAQModal } from '../faq/FAQModal';
import styles from './HelpPanel.module.css';
import Joyride from 'react-joyride';
import { steps1} from '../../tutorial/steps';
import { useTutorial } from '../../tutorial/TutorialContext';
import MyTooltip from '../../tutorial/MyTooltip';
import MyBeacon from '../../tutorial/MyBeacon';
import { tutorialSteps } from '../../tutorial/tutorialSteps';
import { ExamplesModal } from '../modals/ExamplesModal';
import { Preset } from '../../data/presets';

type HelpPanelProps = {
  setPreset: (preset: Preset) => void; 
}
export const HelpPanel = ({ setPreset }: HelpPanelProps) => {
    const { stepIndex, handleJoyrideCallback } = useTutorial();
    const stepIsModal = stepIndex >= 0 && stepIndex < tutorialSteps.length && tutorialSteps[stepIndex].modal;
    const floaterProps = stepIsModal ? { transitionProperty: "none!important" } : {};
    return (
        <div className={styles.panel}>
            {/* <FAQModal /> */}
            <h2 style={{ textAlign: 'center', fontFamily:"Helvetica Neue", marginBottom: '5em', marginTop: '0.2em', fontWeight: 'bold', color: "#444" }}>
            Justin's Δ-Complex Editor
            </h2>
            <Joyride
              tooltipComponent={MyTooltip}
              beaconComponent={MyBeacon}
              steps={tutorialSteps as any}
              run={true}
              floaterProps={{disableAnimation: true, style: floaterProps}}
              continuous={true}
              stepIndex={stepIndex}
              callback={handleJoyrideCallback}
              styles={{
                options: {
                  zIndex: 10000,
                },
              }}
            />
            <ExamplesModal setPreset={setPreset} />
        </div>
    );
}