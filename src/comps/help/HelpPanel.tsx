import { useState } from 'react';
import { FAQModal } from '../faq/FAQModal';
import styles from './HelpPanel.module.css';
import Joyride from 'react-joyride';
import steps from '../../tutorial/steps';

export const HelpPanel = () => {
    return (
        <div className={styles.panel}>
            {/* <FAQModal /> */}
            <Joyride
                    steps={steps}
                    run={true}
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