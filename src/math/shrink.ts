import { Vector3 } from 'three';

// Computes the normal vector of the plane defined by points A, B, C
const computePlaneNormal = (A: Vector3, B: Vector3, C: Vector3): Vector3 => {
  const AB = new Vector3().subVectors(B, A);
  const AC = new Vector3().subVectors(C, A);
  const normal = new Vector3().crossVectors(AB, AC).normalize();
  return normal;
};

// Projects 3D points A, B, and C onto a 2D plane defined by the triangle's plane normal
const projectTo2D = (A: Vector3, B: Vector3, C: Vector3, normal: Vector3) => {
  const u = new Vector3().subVectors(B, A).normalize();
  const v = new Vector3().crossVectors(normal, u).normalize();

  const projectPoint = (P: Vector3): Vector2 => {
    const PA = new Vector3().subVectors(P, A);
    const x = PA.dot(u);
    const y = PA.dot(v);
    return new Vector2(x, y);
  };

  return {
    A2D: new Vector2(0, 0), // A is at origin in 2D
    B2D: projectPoint(B),
    C2D: projectPoint(C),
    u,
    v
  };
};

// Computes the orthocenter of the triangle in 2D
import { Vector2 } from 'three';

const computeOrthocenter2D = (A2D: Vector2, B2D: Vector2, C2D: Vector2): Vector2 => {
  let slopeAB: number | null = null;
  let slopeAC: number | null = null;

  // Check for vertical lines (undefined slopes)
  if (B2D.x !== A2D.x) {
    slopeAB = (B2D.y - A2D.y) / (B2D.x - A2D.x);
  } else {
    slopeAB = Infinity; // Treat vertical line as infinite slope
  }

  if (C2D.x !== A2D.x) {
    slopeAC = (C2D.y - A2D.y) / (C2D.x - A2D.x);
  } else {
    slopeAC = Infinity; // Treat vertical line as infinite slope
  }

  // Handle altitudes based on the slope being vertical, horizontal, or regular
  let altitudeBSlope: number | null = null;
  let altitudeCSlope: number | null = null;

  if (slopeAC === 0) {
    altitudeBSlope = Infinity; // Perpendicular to horizontal line is vertical
  } else if (slopeAC !== Infinity) {
    altitudeBSlope = -1 / slopeAC; // Regular case
  } else {
    altitudeBSlope = 0; // Perpendicular to vertical is horizontal
  }

  if (slopeAB === 0) {
    altitudeCSlope = Infinity; // Perpendicular to horizontal line is vertical
  } else if (slopeAB !== Infinity) {
    altitudeCSlope = -1 / slopeAB; // Regular case
  } else {
    altitudeCSlope = 0; // Perpendicular to vertical is horizontal
  }

  // Compute intercepts (y = mx + b) or handle vertical altitudes
  let altitudeBIntercept: number;
  let altitudeCIntercept: number;

  if (altitudeBSlope !== Infinity && altitudeBSlope !== 0) {
    altitudeBIntercept = B2D.y - altitudeBSlope * B2D.x;
  } else if (altitudeBSlope === Infinity) {
    // Vertical line case: x = B2D.x
    altitudeBIntercept = B2D.x;
  } else {
    // Horizontal line case: y = B2D.y
    altitudeBIntercept = B2D.y;
  }

  if (altitudeCSlope !== Infinity && altitudeCSlope !== 0) {
    altitudeCIntercept = C2D.y - altitudeCSlope * C2D.x;
  } else if (altitudeCSlope === Infinity) {
    // Vertical line case: x = C2D.x
    altitudeCIntercept = C2D.x;
  } else {
    // Horizontal line case: y = C2D.y
    altitudeCIntercept = C2D.y;
  }

  let orthocenterX: number;
  let orthocenterY: number;

  // Compute orthocenter based on different altitude slopes
  if (altitudeBSlope !== Infinity && altitudeCSlope !== Infinity) {
    if (altitudeBSlope !== 0 && altitudeCSlope !== 0) {
      // Both altitudes are non-vertical and non-horizontal
      orthocenterX = (altitudeCIntercept - altitudeBIntercept) / (altitudeBSlope - altitudeCSlope);
      orthocenterY = altitudeBSlope * orthocenterX + altitudeBIntercept;
    } else if (altitudeBSlope === 0) {
      // Altitude B is horizontal
      orthocenterY = altitudeBIntercept;
      orthocenterX = (orthocenterY - altitudeCIntercept) / altitudeCSlope;
    } else if (altitudeCSlope === 0) {
      // Altitude C is horizontal
      orthocenterY = altitudeCIntercept;
      orthocenterX = (orthocenterY - altitudeBIntercept) / altitudeBSlope;
    }
  } else if (altitudeBSlope === Infinity) {
    // Altitude B is vertical (x = B2D.x)
    orthocenterX = B2D.x;
    orthocenterY = altitudeCSlope! * orthocenterX + altitudeCIntercept;
  } else if (altitudeCSlope === Infinity) {
    // Altitude C is vertical (x = C2D.x)
    orthocenterX = C2D.x;
    orthocenterY = altitudeBSlope! * orthocenterX + altitudeBIntercept;
  } else {
    throw new Error("Both altitudes cannot be vertical or horizontal simultaneously in a valid triangle.");
  }

  return new Vector2(orthocenterX, orthocenterY);
};

export { computeOrthocenter2D };


// Maps the 2D orthocenter back to 3D space
const mapTo3D = (orthocenter2D: Vector2, A: Vector3, u: Vector3, v: Vector3): Vector3 => {
  const ortho3D = new Vector3()
    .addScaledVector(u, orthocenter2D.x)
    .addScaledVector(v, orthocenter2D.y)
    .add(A); // Shift back to A's original position
  return ortho3D;
};

// Combines all steps to compute the orthocenter in 3D space
const computeOrthocenter3D = (triangleVertices: [Vector3, Vector3, Vector3]): Vector3 => {
    if (triangleVertices.length !== 3) {
    throw new Error('Triangle must have 3 vertices');
    }
  const [A, B, C] = triangleVertices;

  const normal = computePlaneNormal(A, B, C);
  const { A2D, B2D, C2D, u, v } = projectTo2D(A, B, C, normal);

  const orthocenter2D = computeOrthocenter2D(A2D, B2D, C2D);
  const orthocenter3D = mapTo3D(orthocenter2D, A, u, v);

  return orthocenter3D;
};

export { computeOrthocenter3D };
