import styles from "../Tutorial.module.css";
import parabolas from "./bits/parabolas";
import threeshapes from "./bits/threeshapes";
export default [
  {
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
    content: (
      <>
        <p>
          However, many things that aren't physical objects also have useful geometric properties. Consider some datapoints in 2D (where each point is described by two numbers):
        </p>
        <p>
          {parabolas}
          <p>
            We may want to compress this data by fitting it to a smooth function, so that we can treat each point as a point on a line, instead of in 2D space, so that it can be descibed with just 1 number. However, the two above plots show that the shape of data affects our ability to do this.
          </p>
        </p>
      </>
    ),
  },
  {
    target: "body",
    content: "Click next to continue.",
  },
];
//
// ];
