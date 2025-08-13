import styles from "../Tutorial.module.css";
import parabolas from "./bits/parabolas";
import threeshapes from "./bits/threeshapes";
export default [
  {
    disable: true,
    title: "What is topology?",
    target: ".modalHolder",
    modal: true,
    content: (
      <>
        <a href="https://commons.wikimedia.org/wiki/File:Mug_and_Torus_morph.gif#/media/File:Mug_and_Torus_morph.gif">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/26/Mug_and_Torus_morph.gif"
            alt="Mug and Torus morph.gif"
            height="240"
            width="240"
          ></img>
        </a>
        Topology is the study of <i>space in general</i>, where the properties
        we care about concern how a space is connected internally.
      </>
    ),
  },
  
  {
    title: "Next",
    target: ".modalHolder",
    modal: true,
    content: (
      <>
        <p>Let's begin by a comparison to a more familiar subject: geometry.</p>
            {threeshapes}
        <div
          className={styles.desc}
          style={{ textAlign: "center", width: "100%", marginTop: "-20px" }}
        >
          <i> considered by geometry, these shapes are all distinct objects.</i>
        </div>
        <p>
          In geometry, we study shapes like these and care about properties such
          as angles, lengths, and areas.
        </p>
        <p>
          The construction of anything physical relies so intuitively on
          geometry that examples hardly need stating. We take for granted that
          building any modern structure requires observance of the angles and
          positions of beams, or that wheels are required to be smooth and
          round, or that road lengths must be measured to supply enough
          pavement.{" "}
        </p>
      </>
    ),
  },
  {
    title: "Next",
    modal: true,
    target: ".modalHolder",
    content: (
      <>
        <p>
          However, many things that aren't physical objects also have useful geometric properties. Consider some datapoints in 2D (where each point is described by two numbers):
        </p>
        <p>
          {parabolas}
          <p>
            To make predictions about data, we always want to find correlations between the variables. In particular, it is useful for one variable to be a smooth function of another. The shape of the data can tell us whether or not we can find such a function.
          </p>
        </p>
      </>
    ),
  },
 
  {
    modal: true,

    content:<div>
    Consider one of the earliest motivations for topology: <a href="https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg">the Königsberg bridges problem</a>. 
    <br />
    The mathematician Leonhard Euler wondered whether or not it is possible to walk through the city of Königsberg and cross each of its seven bridges exactly once. 
     <p>
        <a href="https://commons.wikimedia.org/wiki/File:Konigsberg_bridges.png">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/5d/Konigsberg_bridges.png" 
            alt="Konigsberg bridges" 
            height="238" 
            width="302" 
          />
        </a>
        <br />
        <div className={styles.desc}>
          By Bogdan Giuşcă - Public domain (PD), 
          <a href="http://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a>, 
          <a href="https://commons.wikimedia.org/w/index.php?curid=112920">Link</a>
        </div>
      </p>
    </div>
  
  },
];
//
// ];
