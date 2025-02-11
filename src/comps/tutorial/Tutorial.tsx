import React, { useState } from 'react';
import Joyride, { Step } from 'react-joyride';

const Tutorial = () => {
  const [run, setRun] = useState(false);

  const steps: Step[] = [
    {
      target: '.settings-button',
      content: 'Click here to access your settings!',
    },
    {
      target: '.canvas-container',
      content: 'This is your 3D editor. Use the mouse to pan, zoom, and rotate.',
    },
    {
      target: '.help-button',
      content: 'Need more help? Click here anytime.',
    },
  ];

  const startTutorial = () => {
    setRun(true);
  };

  return (
    <div>
      <button onClick={startTutorial}>Start Tutorial</button>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
    </div>
  );
};

export default Tutorial;
