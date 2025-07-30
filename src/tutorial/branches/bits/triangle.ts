import { AbstractVertex } from "../../../math/classes/cells";


const isInsideTriangle = (point: AbstractVertex, triangle: AbstractVertex[]) => {
    const [a, b, c] = triangle;
    const area = (p1: AbstractVertex, p2: AbstractVertex, p3: AbstractVertex) => 
        Math.abs((p1.point[0] * (p2.point[2] - p3.point[2]) + 
                    p2.point[0] * (p3.point[2] - p1.point[2]) + 
                    p3.point[0] * (p1.point[2] - p2.point[2])) / 2);
    
    const totalArea = area(a, b, c);
    const area1 = area(point, b, c);
    const area2 = area(a, point, c);
    const area3 = area(a, b, point);
    
    return totalArea === area1 + area2 + area3;
};

export default isInsideTriangle;