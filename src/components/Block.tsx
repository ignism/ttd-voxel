import { useEffect, useState } from 'react';
import { BufferGeometry, Vector3 } from 'three';
import { geometryFromTriangles, getWallTriangles } from '../utilities/blockUtilities';
import { getNeightbourVerticesForNeighboursInBlocks } from '../utilities/clusterUtilities';

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

export type BlockType = {
  index: number;
  isActive: boolean;
  position: Vector3;
  vertices: boolean[];
  neighbours: (BlockType | null)[];
  parentCluster: number;
};

type BlockProps = {
  index: number;
  isActive: boolean;
  position: Vector3;
  vertices: boolean[];
  neighbours: (BlockType | null)[];
  parentCluster: number;
  isDebugging?: boolean;
};

const Block = ({ isActive, index, neighbours, position, vertices, parentCluster, isDebugging = false }: BlockProps) => {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useEffect(() => {
    const neighbourVertices: boolean[] = getNeightbourVerticesForNeighboursInBlocks(neighbours);

    const tableIndex = vertices
      .map((vertex, index) => (vertex ? Math.pow(2, index) : 0))
      .reduce((previous, current) => previous + current);

    const topTriangles = triangleTable.find((table) => table.index === tableIndex)?.triangles;

    if (topTriangles) {
      const leftTriangles = getWallTriangles(
        [0, 2, 4, 6, 8],
        [vertices[0], vertices[2], vertices[4], vertices[6], vertices[8]],
        [neighbourVertices[0], neighbourVertices[1], neighbourVertices[2], neighbourVertices[3], neighbourVertices[4]]
      );

      const rightTriangles = getWallTriangles(
        [3, 1, 7, 5, 9],
        [vertices[3], vertices[1], vertices[7], vertices[5], vertices[9]],
        [neighbourVertices[5], neighbourVertices[6], neighbourVertices[7], neighbourVertices[8], neighbourVertices[9]]
      );

      const backTriangles = getWallTriangles(
        [1, 0, 5, 4, 10],
        [vertices[1], vertices[0], vertices[5], vertices[4], vertices[10]],
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
        [vertices[2], vertices[3], vertices[6], vertices[7], vertices[11]],
        [
          neighbourVertices[15],
          neighbourVertices[16],
          neighbourVertices[17],
          neighbourVertices[18],
          neighbourVertices[19],
        ]
      );

      const triangles = topTriangles
        .concat(leftTriangles)
        .concat(rightTriangles)
        .concat(backTriangles)
        .concat(frontTriangles);

      setGeometry(geometryFromTriangles(position, triangles));
    }
  }, []);

  return (
    <>
      {geometry && (
        <mesh geometry={geometry}>
          <meshStandardMaterial />
        </mesh>
      )}
    </>
  );
};
export default Block;
