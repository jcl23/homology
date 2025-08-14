// EdgeArrow.tsx
import * as THREE from 'three';
import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Create an arrow texture
const makeArrowGeometry = (width=0.6, height=0.3, thickness=0.07) => {
    // Create arrow shape (outer triangle and inner triangle)
    debugger;
    const shape = new THREE.Shape();
    const arrowUpSlope = height * 2 / width;
    const arrowEdgeSlope = -1 / arrowUpSlope;
    const bottomPointX = 1 / Math.cos(arrowEdgeSlope) * thickness;
    console.log(`123:Bottom point X: ${bottomPointX}`);
    const missingEdgeLength = Math.sqrt(bottomPointX * bottomPointX - thickness * thickness); 
    console.log(`123:Missing edge length: ${missingEdgeLength}`);
    const missingApexX = missingEdgeLength * missingEdgeLength / bottomPointX
    console.log(`123:Missing apex X: ${missingApexX}`);
    const missingApexY = missingApexX / arrowUpSlope;
    console.log(`123:Missing apex Y: ${missingApexY}`);
    const c = -0.3;
    const d = -0.3;
    const iw = 0.05;
    shape.moveTo(c + 0,                     d + 0.5 * width - iw);      // Top point (swapped from 0.5 * width, 0)
    shape.lineTo(c + height - missingApexY, d + missingApexX);  
    shape.lineTo(c + height,                d + bottomPointX);
    shape.lineTo(c + 0.13,                   d + 0.3- iw);
    shape.lineTo(c + 0,                     d + 0.5 * width - iw);      // Top point (swapped from 0.5 * width, 0)
    
    shape.moveTo(c + 0,                     d + 0.5 * width + iw);      
    shape.lineTo(c + 0.13,                   d + 0.3 + iw);

    shape.lineTo(c + height,                d + width - bottomPointX);
    shape.lineTo(c + height - missingApexY, d + width - missingApexX);
    // shape.lineTo(c + 0,                     d + 0.5 * width);      // Back to top
    // Inner triangle (cut out)
      // Back to inner top to close
    
    // shape.holes.push(hole);
    
    const geometry = new THREE.ShapeGeometry(shape);
    return geometry;
};


export interface EdgeArrowProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  scale?: number;
  selected?: boolean;
}
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();

export const EdgeArrow: React.FC<EdgeArrowProps> = ({
  start,
  end,
  scale = 0.5,
  selected = false,
}) => {
  const spriteRef = useRef<THREE.Sprite>(null);

  const { camera } = useThree();
    const color = selected ? selectedBg : unselectedFg;
  useFrame(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;

    // // Midpoint of the edge
    // sprite.position.copy(start).add(end).multiplyScalar(0.5);
    // Convert above to weighted midpoint average:
    // Calculate weighted midpoint with constant c (between 0 and 1)
    const c = 0.58; // Adjust this value between 0 and 1 to control arrow position
    sprite.position.copy(start.clone().multiplyScalar(1 - c).add(end.clone().multiplyScalar(c)));
    // Project start/end to NDC for screen-space direction
    const startProj = start.clone().project(camera);
    const endProj = end.clone().project(camera);

    const aspectRatio = 2;
    const dx = (endProj.x - startProj.x) * aspectRatio;
    const dy = endProj.y - startProj.y;
    
    const angle = Math.atan2(dy, dx);

    // log rotation in readable degrees
    // console.log(`Arrow rotation angle: ${angle * (180 / Math.PI)} degrees`);

    // console.log(`Arrow angle: ${angle}`);
    sprite.material.rotation = angle;
  });

  return (
    <sprite 
        geometry={makeArrowGeometry()}
        renderOrder={-29000000} ref={spriteRef} scale={[scale, scale, 1]} >
      <spriteMaterial
        
                //   depthTest={true}
                            depthWrite={false}
        color={color}
      />
      
    </sprite>
  );
};
