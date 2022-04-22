import { Box, Html } from '@react-three/drei';
import { BoxGeometry, BufferAttribute, BufferGeometry, EdgesGeometry, Vector3 } from 'three';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

const vertexTable = [
  [-0.5, -0.25, -0.5],
  [0.5, -0.25, -0.5],
  [0.5, -0.25, 0.5],
  [-0.5, -0.25, 0.5],
  [-0.5, 0.25, -0.5],
  [0.5, 0.25, -0.5],
  [0.5, 0.25, 0.5],
  [-0.5, 0.25, 0.5],
  [0, -0.25, -0],
  [0, 0, -0.5],
  [0.5, 0, -0],
  [0, 0, 0.5],
  [-0.5, 0, -0],
  [0, 0.25, -0],
];

// const triangleTable = [
//   // // bottom
//   // { index: 7, triangles: [[0, 1, 2]] },
//   // { index: 11, triangles: [[0, 1, 3]] },
//   // { index: 13, triangles: [[0, 2, 3]] },
//   // { index: 14, triangles: [[1, 2, 3]] },
//   // {
//   //   index: 15,
//   //   triangles: [
//   //     [0, 1, 2],
//   //     [0, 2, 3],
//   //   ],
//   // },
//   // walls back
//   { index: 19, triangles: [[0, 4, 1]] },
//   { index: 35, triangles: [[0, 5, 1]] },
//   { index: 49, triangles: [[0, 4, 5]] },
//   { index: 50, triangles: [[1, 4, 5]] },
//   {
//     index: 51,
//     triangles: [
//       [0, 4, 1],
//       [1, 4, 5],
//     ],
//   },
//   // walls right
//   { index: 38, triangles: [[1, 5, 2]] },
//   { index: 70, triangles: [[1, 6, 2]] },
//   { index: 98, triangles: [[1, 5, 6]] },
//   { index: 100, triangles: [[2, 5, 6]] },
//   {
//     index: 102,
//     triangles: [
//       [1, 5, 2],
//       [2, 5, 6],
//     ],
//   },
//   // walls front
//   { index: 76, triangles: [[2, 6, 3]] },
//   { index: 140, triangles: [[2, 7, 3]] },
//   { index: 196, triangles: [[2, 6, 7]] },
//   { index: 200, triangles: [[3, 6, 7]] },
//   {
//     index: 204,
//     triangles: [
//       [2, 6, 3],
//       [3, 6, 7],
//     ],
//   },
//   // walls left
//   { index: 25, triangles: [[0, 3, 4]] },
//   { index: 137, triangles: [[0, 3, 7]] },
//   { index: 145, triangles: [[0, 7, 4]] },
//   { index: 152, triangles: [[3, 7, 4]] },
//   {
//     index: 153,
//     triangles: [
//       [0, 3, 4],
//       [3, 7, 4],
//     ],
//   },
//   // combined walls back + right
//   { index: 19, triangles: [[0, 4, 1]] },
//   { index: 35, triangles: [[0, 5, 1]] },
//   { index: 49, triangles: [[0, 4, 5]] },
//   { index: 50, triangles: [[1, 4, 5]] },
//   {
//     index: 51,
//     triangles: [
//       [0, 4, 1],
//       [1, 4, 5],
//     ],
//   },
//   // top
//   { index: 112, triangles: [[4, 6, 5]] },
//   { index: 176, triangles: [[4, 7, 5]] },
//   { index: 208, triangles: [[4, 7, 6]] },
//   { index: 224, triangles: [[5, 7, 6]] },
//   {
//     index: 240,
//     triangles: [
//       [4, 6, 5],
//       [4, 7, 6],
//     ],
//   },
//   // ramps
//   {
//     index: 195,
//     triangles: [
//       [0, 6, 1],
//       [0, 7, 6],
//     ],
//   },
//   {
//     index: 150,
//     triangles: [
//       [1, 7, 2],
//       [1, 4, 7],
//     ],
//   },
//   {
//     index: 60,
//     triangles: [
//       [2, 4, 3],
//       [2, 5, 4],
//     ],
//   },
//   {
//     index: 105,
//     triangles: [
//       [3, 5, 0],
//       [3, 6, 5],
//     ],
//   },
//   // corner ramps
//   {
//     index: 75,
//     triangles: [
//       [0, 3, 1],
//       [1, 3, 6],
//     ],
//   },
//   {
//     index: 135,
//     triangles: [
//       [0, 2, 1],
//       [0, 7, 2],
//     ],
//   },
//   {
//     index: 30,
//     triangles: [
//       [1, 3, 2],
//       [1, 4, 3],
//     ],
//   },
//   {
//     index: 45,
//     triangles: [
//       [0, 3, 2],
//       [0, 2, 5],
//     ],
//   },
// ];

const triangleTable = [
  // top
  {
    index: 8432,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
    ],
  },
  // top + walls back
  {
    index: 8945,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [0, 4, 5],
    ],
  },
  {
    index: 8946,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [1, 4, 5],
    ],
  },
  {
    index: 8947,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [0, 5, 1],
      [0, 4, 5],
    ],
  },
  // top + walls right
  {
    index: 9458,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [1, 5, 6],
    ],
  },
  {
    index: 9460,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [2, 5, 6],
    ],
  },
  {
    index: 9462,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [1, 5, 6],
      [1, 6, 2],
    ],
  },
  // top + walls front
  {
    index: 10484,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [2, 6, 7],
    ],
  },
  {
    index: 10488,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [3, 6, 7],
    ],
  },
  {
    index: 10492,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [2, 6, 7],
      [2, 7, 3],
    ],
  },
  // top + walls left
  {
    index: 12536,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [3, 7, 4],
    ],
  },
  {
    index: 12529,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [0, 7, 4],
    ],
  },
  {
    index: 12537,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [3, 7, 4],
      [3, 4, 0],
    ],
  },
  // top + walls back right
  {
    index: 9970,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [1, 4, 5],
      [1, 5, 6],
    ],
  },
  {
    index: 9971,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [0, 5, 1],
      [0, 4, 5],
      [1, 5, 6],
    ],
  },
  {
    index: 9973,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [0, 4, 5],
      [2, 5, 6],
    ],
  },
  {
    index: 9974,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [1, 4, 5],
      [1, 5, 6],
      [1, 6, 2],
    ],
  },
  {
    index: 9975,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [0, 5, 1],
      [0, 4, 5],
      [1, 5, 6],
      [1, 6, 2],
    ],
  },
  // top + walls right front
  {
    index: 11508,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [2, 5, 6],
      [2, 6, 7],
    ],
  },
  {
    index: 11518,
    triangles: [
      [4, 6, 5],
      [4, 7, 6],
      [1, 5, 6],
      [1, 6, 2],
      [2, 6, 7],
      [2, 7, 3],
    ],
  },
];

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

const Debug = () => {
  const [cubeIndex, setCubeIndex] = useState(0);
  const [triangles, setTriangles] = useState<number[][] | undefined>(undefined);

  const edges = useMemo(() => {
    const box = new BoxGeometry(1, 0.5, 1);
    const edge = new EdgesGeometry(box);

    return edge;
  }, []);

  const onClick = (index: number) => {
    setCubeIndex(cubeIndex ^ (1 << index));
  };

  useEffect(() => {
    console.log(cubeIndex);

    setTriangles(triangleTable.find((t) => t.index === cubeIndex)?.triangles);
  }, [cubeIndex]);

  return (
    <>
      <line>
        <lineSegments args={[edges]} />
        <lineBasicMaterial />
      </line>

      {vertexTable.map((v, index) => (
        <VertexLabel key={`vertex-${index}`} position={new Vector3(...v)} index={index} onClick={onClick} />
      ))}

      {triangles?.map((vertices, index) => (
        <Triangle key={`triangle-${index}`} vertices={vertices} />
      ))}
    </>
  );
};

export default Debug;
