import { useEffect, useMemo, useState } from 'react';
import { BoxGeometry, BufferAttribute, BufferGeometry, EdgesGeometry, Mesh, Vector3 } from 'three';
import { useClusterStore } from '../utilities/clusterStore';
import { getNeightbourVerticesForNeighboursInBlocks } from '../utilities/clusterUtilities';
import VertexLabel from './VertexLabel';

//

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

const neighbourTable = [
  // left 0 2 4 6 8
  [-0.65, -0.25, -0.5],
  [-0.65, -0.25, 0.5],
  [-0.65, 0.25, -0.5],
  [-0.65, 0.25, 0.5],
  [-0.65, 0, 0],
  // right 3 1 7 5 9
  [0.65, -0.25, 0.5],
  [0.65, -0.25, -0.5],
  [0.65, 0.25, 0.5],
  [0.65, 0.25, -0.5],
  [0.65, 0, 0],
  // back 1 0 5 4 10
  [0.5, -0.25, -0.65],
  [-0.5, -0.25, -0.65],
  [0.5, 0.25, -0.65],
  [-0.5, 0.25, -0.65],
  [0, 0, -0.65],
  // front 2 3 6 7 11
  [-0.5, -0.25, 0.65],
  [0.5, -0.25, 0.65],
  [-0.5, 0.25, 0.65],
  [0.5, 0.25, 0.65],
  [0, 0, 0.65],
];

//

const triangleTable = [
  // full
  {
    index: 4095,
    triangles: [
      [4, 6, 5],
      [5, 6, 7],
    ],
  },
  // double ramp
  {
    index: 4079,
    triangles: [
      [0, 8, 10],
      [6, 10, 8],
      [5, 10, 6],
      [7, 5, 6],
    ],
  },
  {
    index: 4063,
    triangles: [
      [1, 10, 9],
      [4, 9, 10],
      [7, 9, 4],
      [6, 7, 4],
    ],
  },
  {
    index: 4031,
    triangles: [
      [2, 11, 8],
      [7, 8, 11],
      [4, 8, 7],
      [5, 4, 7],
    ],
  },
  {
    index: 3967,
    triangles: [
      [3, 9, 11],
      [5, 11, 9],
      [6, 11, 5],
      [4, 6, 5],
    ],
  },
  // ramp
  {
    index: 3759,
    triangles: [
      [2, 11, 0],
      [0, 11, 10],
      [11, 7, 10],
      [5, 10, 7],
    ],
  },
  {
    index: 3423,
    triangles: [
      [1, 10, 3],
      [3, 10, 11],
      [4, 11, 10],
      [6, 11, 4],
    ],
  },
  {
    index: 3023,
    triangles: [
      [0, 8, 1],
      [1, 8, 9],
      [6, 7, 8],
      [7, 9, 8],
    ],
  },
  {
    index: 1855,
    triangles: [
      [3, 9, 2],
      [2, 9, 8],
      [9, 5, 8],
      [4, 8, 5],
    ],
  },
  // valley
  {
    index: 3999,
    triangles: [
      [1, 10, 2],
      [2, 10, 8],
      [4, 8, 10],
      [2, 11, 1],
      [1, 11, 9],
      [7, 9, 11],
    ],
  },
  {
    index: 3951,
    triangles: [
      [0, 8, 3],
      [3, 8, 11],
      [6, 11, 8],
      [3, 9, 0],
      [0, 9, 10],
      [5, 10, 9],
    ],
  },
  // ramp corner
  {
    index: 2703,
    triangles: [
      [0, 2, 1],
      [2, 11, 1],
      [1, 11, 9],
      [7, 9, 11],
    ],
  },
  {
    index: 2383,
    triangles: [
      [1, 0, 3],
      [0, 8, 3],
      [3, 8, 11],
      [6, 11, 8],
    ],
  },
  {
    index: 1583,
    triangles: [
      [2, 3, 0],
      [3, 9, 0],
      [0, 9, 10],
      [5, 10, 9],
    ],
  },
  {
    index: 1311,
    triangles: [
      [3, 1, 2],
      [1, 10, 2],
      [2, 10, 8],
      [4, 8, 10],
    ],
  },
];

type TriangleProps = {
  vertices: number[];
};

const Triangle = ({ vertices }: TriangleProps) => {
  const position = new Float32Array(vertices.map((index) => vertexTable[index]).flat());
  // const ref = useRef<BufferGeometry|undefined>(undefined)
  const attribute = new BufferAttribute(position, 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', attribute);
  geometry.computeVertexNormals();

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial />
    </mesh>
  );
};

//

const getWallTriangles = (indices: number[], vertices: boolean[], neighbourVertices: boolean[]): number[][] => {
  const triangleTable = [
    [0, 1, 4],
    [1, 3, 4],
    [2, 0, 4],
    [3, 2, 4],
  ];

  const triangles = triangleTable
    .filter((vertexIndices) => {
      // filter triangles where all vertices are true
      return vertices[vertexIndices[0]] && vertices[vertexIndices[1]] && vertices[vertexIndices[2]];
    })
    .filter((vertexIndices) => {
      // filter triangles if there is a neighbour triangle missing, so when one member of neighbourVertices equals false
      return !(
        neighbourVertices[vertexIndices[0]] &&
        neighbourVertices[vertexIndices[1]] &&
        neighbourVertices[vertexIndices[2]]
      );
    })
    .map((tableIndices) => {
      return [indices[tableIndices[0]], indices[tableIndices[1]], indices[tableIndices[2]]];
    });

  return triangles;
};

export type BlockType = {
  index: number;
  isActive: boolean;
  position: Vector3;
  vertices: boolean[];
  neighbours: number[];
};

type BlockProps = {
  index: number;
  isActive: boolean;
  position: Vector3;
  vertices: boolean[];
  neighbours: number[];
  isDebugging?: boolean;
};

const DebugBlock = ({ isActive, index, neighbours, position, vertices, isDebugging = false }: BlockProps) => {
  const { blocks } = useClusterStore();
  const [neighbourVertices, setNeighbourVertices] = useState<boolean[]>(Array.from({ length: 16 }).map(() => false));
  const [geometry, setGeometry] = useState<Mesh>(new Mesh());
  const [debugVertices, setDebugVertices] = useState<boolean[]>([]);
  const [triangles, setTriangles] = useState<number[][] | null>(null);

  const handleClick = (index: number) => {
    const currentVertices = debugVertices.slice();
    currentVertices[index] = !currentVertices[index];
    setDebugVertices(currentVertices);
  };

  useEffect(() => {
    const currentNeighbourVertices: boolean[] = getNeightbourVerticesForNeighboursInBlocks(neighbours, blocks);
    setNeighbourVertices(currentNeighbourVertices);
  }, [blocks, neighbours]);

  useEffect(() => {
    setDebugVertices(vertices);
  }, []);

  useEffect(() => {
    let total = 0;

    debugVertices.forEach((v, index) => {
      total += v ? Math.pow(2, index) : 0;
    });

    const tableIndex = vertices
      .map((vertex, index) => (vertex ? Math.pow(2, index) : 0))
      .reduce((previous, current) => previous + current);

    const tableVertices = debugVertices.map((vertex, index) => (vertex ? Math.pow(2, index) : 0));

    console.log('!!!!!', tableVertices);

    const topTriangles = triangleTable.find((table) => table.index === total)?.triangles;

    const leftTriangles = getWallTriangles(
      [0, 2, 4, 6, 8],
      [debugVertices[0], debugVertices[2], debugVertices[4], debugVertices[6], debugVertices[8]],
      [neighbourVertices[0], neighbourVertices[1], neighbourVertices[2], neighbourVertices[3], neighbourVertices[4]]
    );

    const rightTriangles = getWallTriangles(
      [3, 1, 7, 5, 9],
      [debugVertices[3], debugVertices[1], debugVertices[7], debugVertices[5], debugVertices[9]],
      [neighbourVertices[5], neighbourVertices[6], neighbourVertices[7], neighbourVertices[8], neighbourVertices[9]]
    );

    const backTriangles = getWallTriangles(
      [1, 0, 5, 4, 10],
      [debugVertices[1], debugVertices[0], debugVertices[5], debugVertices[4], debugVertices[10]],
      [
        neighbourVertices[10],
        neighbourVertices[11],
        neighbourVertices[12],
        neighbourVertices[13],
        neighbourVertices[14],
      ]
    );

    const frontTriangles = getWallTriangles(
      [2, 3, 6, 7, 11],
      [debugVertices[2], debugVertices[3], debugVertices[6], debugVertices[7], debugVertices[11]],
      [
        neighbourVertices[15],
        neighbourVertices[16],
        neighbourVertices[17],
        neighbourVertices[18],
        neighbourVertices[19],
      ]
    );

    const triangleVertices = topTriangles
      ?.concat(leftTriangles)
      .concat(rightTriangles)
      .concat(backTriangles)
      .concat(frontTriangles);

    if (triangleVertices) {
      setTriangles(triangleVertices);
    } else {
      setTriangles(null);
    }
  }, [debugVertices]);

  const edges = useMemo(() => {
    const box = new BoxGeometry(1, 0.5, 1);
    const edge = new EdgesGeometry(box);

    return edge;
  }, []);

  return (
    <>
      <group position={position}>
        <line>
          <lineSegments args={[edges]} />
          <lineBasicMaterial />
        </line>

        {triangles?.map((vertices, index) => (
          <Triangle key={`triangle-${index}`} vertices={vertices} />
        ))}

        {isDebugging &&
          vertexTable.map((v, index) => (
            <VertexLabel
              key={`vertex-${index}`}
              position={new Vector3(...v)}
              isActive={debugVertices[index]}
              onClick={() => handleClick(index)}
              index={index}
              color={'bg-orange-400'}
            />
          ))}
        {isDebugging &&
          neighbourTable.map((n, index) => {
            return (
              <VertexLabel
                key={`neighbour-${index}`}
                position={new Vector3(...n)}
                isActive={neighbourVertices[index]}
                index={index}
                color={'bg-teal-400'}
              />
            );
          })}
      </group>
    </>
  );
};

export default DebugBlock;
