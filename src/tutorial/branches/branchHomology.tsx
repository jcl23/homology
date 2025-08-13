import styles from "../Tutorial.module.css";
import parabolas from "./bits/parabolas";
import threeshapes from "./bits/threeshapes";
export default [
  {
    title: "What is homology?",
    target: ".modalHolder",
    modal: true,
    disable: true,
    content: (
      <>
        Mathematicians like to be able to tell shapes apart.
        <img src="tutorial/media/triangle.PNG" alt="triangle" height="240" width="520" />  
        <br /> During your childhood math education, you may have been required to but were practice for proving things that aren't obvious. <br />It may seem natural that we can tell two shapes apart by just looking at them. But this isn't always the case.
    
      </>
    ),
  },
]