import { Line } from "@react-three/drei";

type CustomGridProps = {
    gridSize: number;
    gridExtent: number;
};

// TODO extend this to make it possible to be hexagonal!
const CustomGrid = ({ gridSize, gridExtent }: CustomGridProps) => {
    const lines = [];
    for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
      lines.push([
        [-gridExtent, 0, i],
        [gridExtent, 0, i],
      ]);
      lines.push([
        [i, 0, -gridExtent],
        [i, 0, gridExtent],
      ]);
    }
  
    return (
      <>
        {lines.map((line, index) => (
          <Line key={index} points={line} color="lightgray" lineWidth={1}  />
        ))}
      </>
    );
  };

  export default CustomGrid;