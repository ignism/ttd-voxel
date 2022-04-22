import { Html, Sphere } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { Vector3 } from 'three';

type VertexLabelProps = {
  position: Vector3;
  index: number;
  onClick: (index: number) => void;
};

const VertexLabel = ({ position, index, onClick }: VertexLabelProps) => {
  const [isActive, toggleActive] = useState(false);
  const handleClick = () => {
    toggleActive((state) => !state);
    onClick(index);
  };

  const isCenterVertex = index >= 8 && index <= 13;

  return (
    <Html position={position}>
      <div
        onClick={handleClick}
        className={`cursor-pointer rounded-full ${
          !isActive ? 'bg-slate-400' : isCenterVertex ? 'bg-orange-400' : 'bg-green-400'
        } hover:bg-white text-black -ml-2 -mt-2 w-4 h-4 text-xs select-none flex justify-center items-center`}
      >
        {index}
      </div>
    </Html>
  );
};

const gridWidth = 8;
const gridLength = 8;
const gridHeight = 8;

const initialGrid = Array.from({ length: gridWidth * gridLength * gridHeight }).map(
  (state, index) => index < gridWidth * gridLength
);
const Grid = () => {
  const [grid, setGrid] = useState(initialGrid);

  useEffect(() => {
    console.log('render');
  }, []);
  return (
    <>
      {grid.map((state, index) => {
        const x = index % gridWidth;
        const y = Math.floor(index / gridWidth) % gridLength;
        const z = Math.floor(index / (gridWidth * gridLength));
        const v = new Vector3(x, y, z);

        const;
        // return <VertexLabel key={`vertex-${index}`} position={v} index={index} onClick={() => false} />;
        return <Sphere position={v} args={[0.05]} />;
      })}
    </>
  );
};

const getVertexBelow = (index: number): number => {
  return 0;
};

export default Grid;
