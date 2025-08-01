import styles from "../../Tutorial.module.css";
import { generateParabolaAnimationPath } from "../../../math/parabolaAnimate.tsx";
const path1 = generateParabolaAnimationPath(
  [
    [0.01, 80, 110],    // End parabola (curved)
    [-0.018, 100, 130],   // Start parabola (nearly flat)
    [-0.018, 100, 130],   // Start parabola (nearly flat)
  ],
  200, 200,     // width, height
  50,           // steps
  4,            // duration
);
const path2 = generateParabolaAnimationPath(
  [
    [0.01, 80, 60],    // End parabola (curved)
    [-0.01, 130, 130],   // Start parabola (nearly flat)
    [0.01, 80, 80],    // End parabola (curved)
    [-0.01, 130, 130],   // Start parabola (nearly flat)
    [0.01, 80, 60],    // End parabola (curved)
  ],
  200, 200,     // width, height
  50,           // steps
  8,            // duration
);
export default (
  <div
    style={{
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      margin: "20px 50px",
    }}
  >
    <div>
      <svg width="168" height="160" viewBox="-10 0 200 200">
        {/* Axes */}
        <line
          x1="10"
          y1="180"
          x2="180"
          y2="180"
          stroke="black"
          strokeWidth="1"
        />
        <line x1="20" y1="20" x2="20" y2="190" stroke="black" strokeWidth="1" />

        {/* Animated parabola path */}
        {path1}

        {/* Points forming a parabola with lowest point at cx=100 */}
        <circle cx="32" cy="168" r="3" fill="blue" />
        <circle cx="43" cy="150" r="3" fill="blue" />
        <circle cx="48" cy="120" r="3" fill="blue" />
        <circle cx="62" cy="105" r="3" fill="blue" />
        <circle cx="71" cy="90" r="3" fill="blue" />
        <circle cx="78" cy="70" r="3" fill="blue" />
        <circle cx="88" cy="73" r="3" fill="blue" />
        <circle cx="100" cy="70" r="3" fill="blue" />
        <circle cx="112" cy="72" r="3" fill="blue" />
        <circle cx="123" cy="80" r="3" fill="blue" />
        <circle cx="127" cy="93" r="3" fill="blue" />
        <circle cx="143" cy="100" r="3" fill="blue" />
        <circle cx="152" cy="120" r="3" fill="blue" />
        <circle cx="158" cy="140" r="3" fill="blue" />
        <circle cx="173" cy="168" r="3" fill="blue" />
      </svg>
      <div className={styles.desc} style={{ textAlign: "center" }}>
        ✅ This data can be represented well by parabola.
      </div>
    </div>

    <div>
      <svg width="168" height="160" viewBox="-10 0 200 200">
        {/* Axes */}
        <line
          x1="10"
          y1="180"
          x2="180"
          y2="180"
          stroke="black"
          strokeWidth="1"
        />
        <line x1="20" y1="20" x2="20" y2="190" stroke="black" strokeWidth="1" />

        {/* Animated circle path */}
        {path2}

        {/* Points forming a circle with y values closer to 100 */}
        <circle cx="98" cy="72" r="3" fill="red" />
        <circle cx="134" cy="77" r="3" fill="red" />
        <circle cx="147" cy="81" r="3" fill="red" />
        <circle cx="163" cy="104" r="3" fill="red" />
        <circle cx="146" cy="112" r="3" fill="red" />
        <circle cx="127" cy="129" r="3" fill="red" />
        <circle cx="96" cy="133" r="3" fill="red" />
        <circle cx="67" cy="122" r="3" fill="red" />
        <circle cx="52" cy="118" r="3" fill="red" />
        <circle cx="37" cy="97" r="3" fill="red" />
        <circle cx="54" cy="82" r="3" fill="red" />
        <circle cx="73" cy="71" r="3" fill="red" />
        <circle cx="88" cy="75" r="3" fill="red" />
        <circle cx="119" cy="68" r="3" fill="red" />
        <circle cx="159" cy="103" r="3" fill="red" />
      </svg>
      <div className={styles.desc} style={{ textAlign: "center" }}>
        ❌ But this data can't be represented well by a parabola, or any function.
      </div>
    </div>
  </div>
);
