import { Html } from '@react-three/drei';
import { useMemo, useState } from 'react';
import { BoxGeometry, EdgesGeometry, Vector3 } from 'three';

const vertexTable = [
  [-0.5, -0.25, -0.5],
  [0.5, -0.25, -0.5],
  [-0.5, -0.25, 0.5],
  [0.5, -0.25, 0.5],

  [-0.5, 0.25, -0.5],
  [0.5, 0.25, -0.5],
  [-0.5, 0.25, 0.5],
  [0.5, 0.25, 0.5],

  [-0.5, 0, 0],
  [0.5, 0, 0],
  [0, 0, -0.5],
  [0, 0, 0.5],
];

type VertexLabelProps = {
  position: Vector3;
  index: number;
  isActive: boolean;
  handleClick: (index: number) => void;
};

const VertexLabel = ({ position, index, isActive, handleClick }: VertexLabelProps) => {
  return (
    <Html position={position}>
      <div
        onClick={() => handleClick(index)}
        className={`cursor-pointer rounded-full ${
          !isActive ? 'bg-slate-400' : 'bg-orange-400'
        } hover:bg-white text-black -ml-2 -mt-2 w-4 h-4 text-xs select-none flex justify-center items-center`}
      >
        {index}
      </div>
    </Html>
  );
};

//

type BlockType = {
  position: Vector3;
  shape: number;
  material?: string;
};

type BlockProps = {
  position: Vector3;
  isDebugging?: boolean;
};

const Block = ({ position, isDebugging = false }: BlockProps) => {
  const [vertices, setVertices] = useState<boolean[]>(Array.from({ length: 12 }).map(() => false));

  const handleVertexClick = (index: number) => {
    const currVertices = vertices.slice();
    currVertices[index] = !currVertices[index];
    setVertices(currVertices);
  };

  const edges = useMemo(() => {
    const box = new BoxGeometry(1, 0.5, 1);
    const edge = new EdgesGeometry(box);

    return edge;
  }, []);

  return (
    <>
      {isDebugging && (
        <group position={position}>
          <line>
            <lineSegments args={[edges]} />
            <lineBasicMaterial />
          </line>

          {vertexTable.map((v, index) => (
            <VertexLabel
              key={`vertex-${index}`}
              handleClick={handleVertexClick}
              position={new Vector3(...v)}
              isActive={vertices[index]}
              index={index}
            />
          ))}
        </group>
      )}
    </>
  );
};

export default Block;
