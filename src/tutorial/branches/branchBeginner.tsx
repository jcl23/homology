import styles from '../Tutorial.module.css';

export default [
        {
            title: "What is topology?",
            target: '.modalHolder',
            modal: true,
            content: <>
               <a href="https://commons.wikimedia.org/wiki/File:Mug_and_Torus_morph.gif#/media/File:Mug_and_Torus_morph.gif"><img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Mug_and_Torus_morph.gif" alt="Mug and Torus morph.gif" height="240" width="240"></img></a>
                Topology is the study of <i>space in general</i>, where the properties we care about concern how a space is connected internally.
            </>

        },
        {
            title: "Next",
            target: '.modalHolder',
            modal: true,
            content: <>
                <p>Let's begin by a comparison to a more familiar subject: geometry.</p>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 50px' }}>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        <polygon points="50,10 90,90 10,90" fill="none" stroke="#000" strokeWidth="2" />
                    </svg>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#000" strokeWidth="2" />
                    </svg>
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        <rect x="10" y="10" width="80" height="80" fill="none" stroke="#000" strokeWidth="2" />
                    </svg>
                </div>
                    <div className={styles.desc} style={{ textAlign: 'center', width: '100%', marginTop: '-20px' }}>
                        <i> considered by geometry, these shapes are all distinct objects.</i>
                    </div>
                <p>In geometry, we study shapes like these and care about properties such as angles, lengths, and areas.</p>
                <p>The construction of anything physical relies so intuitively on geometry that examples hardly need stating. We take for granted that building any modern structure requires observance of the angles and positions of beams, or that wheels are required to be smooth and round, or that road lengths must be measured to supply enough pavement. </p>
            </>

        },
        {
            title: 'Next',
            content: <>
                <p>
                However, not everything that is worth considering a "shape" is best embodied in a <i>geometric object</i>.,
                </p>
                <p>
                    <a href="https://commons.wikimedia.org/wiki/File:Konigsberg_bridges.png#/media/File:Konigsberg_bridges.png">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Konigsberg_bridges.png" alt="Konigsberg bridges.png" height="238" width="302"></img>
                    </a>
                    <br />
                    <p className={styles.desc}>
                        By Bogdan Giuşcă - Public domain (PD),based on the image<span typeof="mw:File"><a href="//commons.wikimedia.org/wiki/File:Image-Koenigsberg,_Map_by_Merian-Erben_1652.jpg" class="mw-file-description"></a></span>, <a href="http://creativecommons.org/licenses/by-sa/3.0/" title="Creative Commons Attribution-Share Alike 3.0">CC BY-SA 3.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=112920">Link</a></p>
                    </p>
                    
            </>
        },
        {
            target: 'body',
            content: 'Click next to continue.',
        }
    ]
//    
// ];