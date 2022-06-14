import { Html } from '@react-three/drei';
import { sum } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { BoxGeometry, BufferAttribute, EdgesGeometry, Vector3, BufferGeometry } from 'three';

const vertexTable = [
  [-0.5, -0.25, -0.5],
  [0.5, -0.25, -0.5],
  [-0.5, -0.25, 0.5],
  [0.5, -0.25, 0.5],

  [-0.5, 0.25, -0.5],
  [0.5, 0.25, -0.5],
  [-0.5, 0.25, 0.5],
  [0.5, 0.25, 0.5],
];

const neighbourTable = [
  [0, 0, -1],

  [-1, 0, 0],
  [1, 0, 0],

  [0, 0, 1],
];

const triangleTable = [
  // top
  {
    index: 240,
    triangles: [
      [4, 6, 5],
      [7, 5, 6],
    ],
  },
  {
    index: 255,
    triangles: [
      [4, 6, 5],
      [7, 5, 6],

      [0, 5, 1],
      [0, 4, 5],

      [2, 6, 4],
      [2, 4, 0],

      [1, 7, 3],
      [1, 5, 7],

      [3, 6, 2],
      [3, 7, 6],
    ],
  },
];

type VertexLabelProps = {
  position: Vector3;
  index: number;
  isActive: boolean;
  handleClick: (index: number) => void;
};

type TriangleProps = {
  vertices: number[];
};

const Triangle = ({ vertices }: TriangleProps) => {
  const position = new Float32Array(vertices.map((index) => vertexTable[index]).flat());
  // const ref = useRef<BufferGeometry|undefined>(undefined)
  const attribute = new BufferAttribute(position, 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', attribute);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial />
    </mesh>
  );
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

type NeighbourLabelProps = {
  position: Vector3;
  index: number;
  isActive: boolean;
  handleClick: (index: number) => void;
};

const NeighbourLabel = ({ position, index, isActive, handleClick }: NeighbourLabelProps) => {
  return (
    <Html position={position}>
      <div
        onClick={() => handleClick(index)}
        className={`cursor-pointer rounded-full ${
          !isActive ? 'bg-slate-400' : 'bg-green-400'
        } hover:bg-white text-black -ml-2 -mt-2 w-4 h-4 text-xs select-none flex justify-center items-center`}
      >
        {index}
      </div>
    </Html>
  );
};

const WithNeighbours = () => {
  const [vertices, setVertices] = useState<boolean[]>(Array.from({ length: vertexTable.length }).map(() => false));
  const [neighbours, setNeighbours] = useState<boolean[]>(
    Array.from({ length: neighbourTable.length }).map(() => false)
  );
  const [triangles, setTriangles] = useState<number[][]>([[]]);

  const handleVertexClick = (index: number) => {
    const currVertices = vertices.slice();
    currVertices[index] = !currVertices[index];
    setVertices(currVertices);
  };

  const handleNeighbourClick = (index: number) => {
    const currNeighbours = neighbours.slice();
    currNeighbours[index] = !currNeighbours[index];
    setNeighbours(currNeighbours);
  };

  useEffect(() => {
    const vertexValue = vertices
      .map((v, i) => (v ? Math.pow(2, i) : 0))
      .reduce((previousValue, currentValue) => previousValue + currentValue);
    console.log('🚀 ~ file: WithNeighbours.tsx ~ line 140 ~ useEffect ~ vertexValue', vertexValue);
    const neighbourValue = sum(neighbours.map((n, i) => (n ? Math.pow(2, i + 8) : 0)));
    const triangleIndex = vertexValue + neighbourValue;
    console.log('🚀 ~ file: WithNeighbours.tsx ~ line 154 ~ useEffect ~ triangleIndex', triangleIndex);
    const currTriangles = triangleTable.find((triangle) => triangleIndex === triangle.index);

    if (currTriangles) {
      setTriangles(currTriangles.triangles);
    } else {
      setTriangles([[]]);
    }
  }, [vertices, neighbours]);

  const edges = useMemo(() => {
    const box = new BoxGeometry(1, 0.5, 1);
    const edge = new EdgesGeometry(box);

    return edge;
  }, []);

  return (
    <>
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

      {neighbourTable.map((v, index) => (
        <NeighbourLabel
          key={`neighbour-${index}`}
          handleClick={handleNeighbourClick}
          position={new Vector3(...v)}
          isActive={neighbours[index]}
          index={index}
        />
      ))}

      {triangles?.map((vertices, index) => (
        <Triangle key={`triangle-${index}`} vertices={vertices} />
      ))}
    </>
  );
};

export default WithNeighbours;
