// EdgeArrow.tsx
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { H } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";

// Create an arrow texture
const makeArrowGeometry = (length, showArrows, width = 0.6, height = 0.3, thickness = 0.07) => {
  // Create arrow shape (outer triangle and inner triangle)
  // debugger;
  const shape = new THREE.Shape();
  const arrowUpSlope = (height * 2) / width;
  const arrowEdgeSlope = -1 / arrowUpSlope;
  const bottomPointX = (1 / Math.cos(arrowEdgeSlope)) * thickness;
  // console.log(`123:Bottom point X: ${bottomPointX}`);
  const missingEdgeLength = Math.sqrt(
    bottomPointX * bottomPointX - thickness * thickness
  );
  // console.log(`123:Missing edge length: ${missingEdgeLength}`);
  const missingApexX = (missingEdgeLength * missingEdgeLength) / bottomPointX;
  // console.log(`123:Missing apex X: ${missingApexX}`);
  const missingApexY = missingApexX / arrowUpSlope;
  // console.log(`123:Missing apex Y: ${missingApexY}`);
  const c = 0; // horizontal center offset
  const d = -0.299; // vertical center offset
  const iw = 0.05; // inner width
  const aw = 0.2; // arrow width
  const app = 0.55; // arrow position (proportion)
  const ao = 0; // arrow offset )
  const ap = (app - 0.5) * length + ao - aw/2; // arrow position (absolute)
  const lineTo = (x, y) => {
    shape.lineTo(c + x, d + y);
  }
  const moveTo = (x, y) => {
    shape.moveTo(c + x, d + y);
  }
  moveTo(-length / 2, 0.5 * width + iw);
  lineTo(-length / 2 - iw, 0.5 * width);
  lineTo(-length / 2, 0.5 * width - iw);
  if (showArrows) {
    lineTo(ap, 0.5 * width - iw);
    lineTo(ap, 0.5 * width - aw);
    lineTo(ap + aw - iw, 0.5 * width - iw);
  }
  lineTo(length / 2, 0.5 * width - iw);
  lineTo(length / 2 + iw, 0.5 * width);
  lineTo(length / 2, 0.5 * width + iw);
  if (showArrows) {

    lineTo(ap + aw - iw, 0.5 * width + iw);
    lineTo(ap + 0, 0.5 * width + aw);
    lineTo(ap + 0, 0.5 * width + iw);
  }
  
 
  // shape.holes.push(hole);

  const geometry = new THREE.ShapeGeometry(shape);
  return geometry;
};
function pointForScreenMidpoint(A, B, camera) {
  // Convert to camera space
  const aCam = A.clone().applyMatrix4(camera.matrixWorldInverse);
  const bCam = B.clone().applyMatrix4(camera.matrixWorldInverse);

  // For X
  const mX = (aCam.x / aCam.z + bCam.x / bCam.z) / 2;
  const dx = bCam.x - aCam.x;
  const dz = bCam.z - aCam.z;
  const tX = (mX * aCam.z - aCam.x) / (dx - mX * dz);

  // For Y (optional sanity check — should match if points project linearly)
  const mY = (aCam.y / aCam.z + bCam.y / bCam.z) / 2;
  const dy = bCam.y - aCam.y;
  const tY = (mY * aCam.z - aCam.y) / (dy - mY * dz);

  // Pick t (average if you want to be robust)
  const t = (tX + tY) / 2;

  return A.clone().lerp(B, t);
}
export interface EdgeArrowProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  scale?: number;
  selected?: boolean;
  camera?: THREE.Camera;
  object: THREE.Mesh;
  aspectRatio?: number;
  opacity?: number;
  showArrows?: boolean;
}
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();

const vecToScreen = function(v: THREE.Vector3, camera: THREE.Camera, aspect: number) {
  const vScreen = v.clone().project(camera);
  return new THREE.Vector3(
    (vScreen.x + 1) / 2 * aspect,
    (1 - (vScreen.y + 1) / 2) * 1,
    vScreen.z
  );
}
export const EdgeArrow: React.FC<EdgeArrowProps> = ({
  start,
  end,
  scale = 0.5,
  selected = false,
  object,
  opacity = 1,
  showArrows = true
}) => {
  const { size } = useThree();
  
  const { camera } = useThree();
  const spriteRef = useRef<THREE.Sprite>(null);

  const center = start.clone().add(end).multiplyScalar(0.5);
  const color = selected ? selectedBg : unselectedFg;
  const length = start.distanceTo(end);

  let lengthProj = 0;
  // const htmlRef = useRef<HTMLDivElement>(null);
  useFrame(() => {
    
  const aspectRatio = size.width / size.height;

  const startOnScreen = vecToScreen(start, camera, aspectRatio);
  const endOnScreen = vecToScreen(end, camera, aspectRatio);

    lengthProj = startOnScreen.distanceTo(endOnScreen);
    const sprite = spriteRef.current;
    if (!sprite) return;
  
    // sprite.position.copy(start).add(end).multiplyScalar(0.5);
    // Calculate weighted midpoint with constant c (between 0 and 1)
    const c = 0.5; // Adjust this value between 0 and 1 to control arrow position
    // sprite.position.copy(
    //   pointForScreenMidpoint(start, end, camera)
    // );
    sprite.position.copy(
      start
        .clone()
        .multiplyScalar(1 - c)
        .add(end.clone().multiplyScalar(c))
    );
    // Project start/end to NDC for screen-space direction
    const startProj = start.clone().project(camera);
    const endProj = end.clone().project(camera);
    const centerDelta = center.clone().sub(camera.position);
    
    const projCenter = startProj.clone().add(endProj).multiplyScalar(0.5);

    // const projLength = startProj.distanceTo(endProj);

    // lift the projCenter back into the line
    // const liftedProjCenter = new THREE.Vector3(
    //   projCenter.x * camera.aspect,
    //   projCenter.y,
    //   projCenter.z
    // );

    //const aspectRatio = 2.06;
    const windowZoom = window.devicePixelRatio;
    const dx = (endProj.x - startProj.x);
    const dy = (endProj.y - startProj.y)/aspectRatio;

    const angle = Math.atan2(dy, dx);

    // log rotation in readable degrees
    // console.log(`Arrow rotation angle: ${angle * (180 / Math.PI)} degrees`);

    // console.log(`Arrow angle: ${angle}`);
    const distFromCamera = center.distanceTo(camera.position);
    const v1 = new THREE.Vector3();
    camera.getWorldDirection(v1);
    const v2 = camera.position.clone().sub(center);
    const scale = 700 / windowZoom / camera.zoom; // Adjust scale based on distance from camera
    const d = lengthProj * scale;
    sprite.geometry = makeArrowGeometry(d, showArrows);

    sprite.material.rotation = angle;
    // htmlRef.current!.innerText = `
    //   iw...${window.innerWidth}
    //   ar:${aspectRatio.toFixed(2)}
    //   d:${d}
    //   lengthProj:${lengthProj.toFixed(2)}
    //   start: ${vec2str(startOnScreen)}
    //   end: ${vec2str(endOnScreen)}
    //   windowZoom: ${windowZoom}
    //   ${window.innerWidth * window.innerHeight}
    // `;
  });
  
  const vec2str = (v) => `(${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)})`;
  /*
    // render order
    Board
    Cells
  */

 return (
    <>
    <sprite
      geometry={makeArrowGeometry(1, showArrows)}
      ref={spriteRef}
      scale={[scale, scale, 1]}
      userData={{object}}
    >
      <spriteMaterial
        //   depthTest={true}
        depthWrite={false}
        color={color}
        opacity={opacity}
      />
    {/* <Html ref={htmlRef} style={{width: 0, height: 0, pointerEvents: 'none', userSelect: 'none', fontSize: '15px', color: 'red', }} position={center} center>
      {lengthProj}

    </Html> */}
    </sprite>
  
      </>
  );
};
