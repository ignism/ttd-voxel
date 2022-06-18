import { Html } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import { BoxGeometry, EdgesGeometry, Vector3 } from 'three';
import { useBlockStore } from '../utilities/blockStore';
import VertexLabel from './VertexLabel';

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

const Block = ({ isActive, index, neighbours, position, vertices, isDebugging = false }: BlockProps) => {
  const { blocks } = useBlockStore();
  const [neighbourVertices, setNeighbourVertices] = useState<boolean[]>(Array.from({ length: 16 }).map(() => false));

  useEffect(() => {
    const currentNeighbourVertices: boolean[] = [];

    // left 0 2 4 6 8
    if (neighbours[0] >= 0) {
      currentNeighbourVertices.push(
        blocks[neighbours[0]].vertices[3],
        blocks[neighbours[0]].vertices[1],
        blocks[neighbours[0]].vertices[7],
        blocks[neighbours[0]].vertices[5],
        blocks[neighbours[0]].vertices[9]
      );
    } else {
      currentNeighbourVertices.push(false, false, false, false, false);
    }

    // right 3 1 7 5 9
    if (neighbours[1] >= 0) {
      currentNeighbourVertices.push(
        blocks[neighbours[1]].vertices[0],
        blocks[neighbours[1]].vertices[2],
        blocks[neighbours[1]].vertices[4],
        blocks[neighbours[1]].vertices[6],
        blocks[neighbours[1]].vertices[8]
      );
    } else {
      currentNeighbourVertices.push(false, false, false, false, false);
    }

    // back 1 0 5 4 10
    if (neighbours[2] >= 0) {
      currentNeighbourVertices.push(
        blocks[neighbours[2]].vertices[1],
        blocks[neighbours[2]].vertices[0],
        blocks[neighbours[2]].vertices[5],
        blocks[neighbours[2]].vertices[4],
        blocks[neighbours[2]].vertices[10]
      );
    } else {
      currentNeighbourVertices.push(false, false, false, false, false);
    }

    // front 2 3 6 7 11
    if (neighbours[3] >= 0) {
      currentNeighbourVertices.push(
        blocks[neighbours[3]].vertices[2],
        blocks[neighbours[3]].vertices[3],
        blocks[neighbours[3]].vertices[6],
        blocks[neighbours[3]].vertices[7],
        blocks[neighbours[3]].vertices[11]
      );
    } else {
      currentNeighbourVertices.push(false, false, false, false, false);
    }

    setNeighbourVertices(currentNeighbourVertices);
    console.log('block rendered');
  }, [blocks, index, neighbours]);

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

        {isDebugging &&
          vertexTable.map((v, index) => (
            <VertexLabel
              key={`vertex-${index}`}
              position={new Vector3(...v)}
              isActive={vertices[index]}
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

export default Block;
