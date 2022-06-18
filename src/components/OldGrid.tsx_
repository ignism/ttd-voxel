import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Vector3, BoxBufferGeometry, Object3D, Raycaster, Intersection } from 'three';
import Debug from './Debug';
import { useBlockStore } from '../utilities/blockStore';
import { useInterfaceStore } from '../utilities/interfaceStore';

type VertexLabelProps = {
  isActive: boolean;
  position: Vector3;
  color: string;
  index: number;
  onClick: (index: number) => void;
};

const VertexLabel = ({ isActive, position, color, index, onClick }: VertexLabelProps) => {
  const handleClick = () => {
    onClick(index);
  };

  return (
    <Html position={position}>
      <div
        onClick={handleClick}
        className={`cursor-pointer rounded-full ${
          !isActive ? 'bg-slate-400' : `bg-${color}-400`
        } hover:bg-white text-black -ml-2 -mt-2 w-4 h-4 text-xs select-none flex justify-center items-center`}
      >
        {index}
      </div>
    </Html>
  );
};

const Grid = () => {
  const { blocks, size, vertices, rampModifiers, toggleBlock, toggleVertex, toggleRampModifier } = useBlockStore();
  const [debugPoints, setDebugPoints] = useState<boolean[]>([]);

  const instances: Object3D[] = [];

  blocks.forEach((state, index) => {
    if (state) {
      const x = (index % size.x) - size.x * 0.5;
      const y = Math.floor(index / (size.x * size.z)) - size.y * 0.5;
      const z = (Math.floor(index / size.x) % size.z) - size.z * 0.5;

      const object = new Object3D();
      object.position.set(x + 0.5, y + 0.5, z + 0.5);
      object.updateMatrix();

      instances.push(object);
    }
  });

  const getBlockVertices = (index: number): number[] => {
    const w = size.x + 1;
    const h = size.y + 1;
    const l = size.z + 1;

    const x = index % size.x;
    const z = Math.floor(index / size.x) % size.z;
    const y = Math.floor(index / (size.x * size.z));

    return [
      x + z * w + y * w * l,
      x + 1 + z * w + y * w * l,
      x + (z + 1) * w + y * w * l,
      x + 1 + (z + 1) * w + y * w * l,

      x + z * w + (y + 1) * w * l,
      x + 1 + z * w + (y + 1) * w * l,
      x + (z + 1) * w + (y + 1) * w * l,
      x + 1 + (z + 1) * w + (y + 1) * w * l,

      x + z * size.x + y * size.x * l,
      x + (z + 1) * size.x + y * size.x * l,
      rampModifiers.length / 2 + x + z * w + y * w * size.z,
      rampModifiers.length / 2 + x + 1 + z * w + y * w * size.z,
    ];
  };

  const handleVertexClick = (index: number) => {
    toggleVertex(index);
  };

  const handleModifierClick = (index: number) => {
    console.log('🚀 ~ file: Grid.tsx ~ line 70 ~ handleModifierClick ~ index', index);

    toggleRampModifier(index);
  };

  const handleBlockClick = (index: number) => {
    console.log(getBlockVertices(index));

    toggleBlock(index);

    const state = [
      ...getBlockVertices(index)
        .slice(0, 8)
        .map((index) => vertices[index]),
      ...getBlockVertices(index)
        .slice(8, 12)
        .map((index) => rampModifiers[index]),
    ];

    setDebugPoints(state);
  };

  return (
    <>
      <group position={[-4, 0, 0]}>
        <Debug vertices={debugPoints} />
      </group>

      {blocks.map((state, index) => {
        const x = (index % size.x) - size.x * 0.5;
        const y = Math.floor(index / (size.x * size.z)) - size.y * 0.5;
        const z = (Math.floor(index / size.x) % size.z) - size.z * 0.5;
        const v = new Vector3(x + 0.5, y + 0.5, z + 0.5);

        return (
          <VertexLabel
            key={`block-${index}`}
            isActive={blocks[index]}
            position={v}
            color={'green'}
            index={index}
            onClick={() => handleBlockClick(index)}
          />
        );
      })}

      {vertices.map((state, index) => {
        const x = (index % (size.x + 1)) - size.x * 0.5;
        const y = Math.floor(index / ((size.x + 1) * (size.z + 1))) - size.y * 0.5;
        const z = (Math.floor(index / (size.x + 1)) % (size.z + 1)) - size.z * 0.5;
        const v = new Vector3(x, y, z);

        return (
          <VertexLabel
            key={`vertex-${index}`}
            isActive={vertices[index]}
            position={v}
            color={'purple'}
            index={index}
            onClick={handleVertexClick}
          />
        );
      })}

      {rampModifiers.slice(0, rampModifiers.length / 2).map((state, index) => {
        const x = (index % size.x) - size.x * 0.5;
        const y = Math.floor(index / (size.x * (size.z + 1))) - size.y * 0.5;
        const z = (Math.floor(index / size.x) % (size.z + 1)) - size.z * 0.5;
        const v = new Vector3(x + 0.5, y + 0.5, z);

        return (
          <VertexLabel
            key={`rampmodifier-${index}`}
            isActive={rampModifiers[index]}
            position={v}
            color={'red'}
            index={index}
            onClick={handleModifierClick}
          />
        );
      })}

      {rampModifiers.slice(rampModifiers.length / 2, rampModifiers.length).map((state, index) => {
        const x = (index % (size.x + 1)) - size.x * 0.5;
        const y = Math.floor(index / ((size.x + 1) * size.z)) - size.y * 0.5;
        const z = (Math.floor(index / (size.x + 1)) % size.z) - size.z * 0.5;
        const v = new Vector3(x, y + 0.5, z + 0.5);

        const arrayIndex = index + rampModifiers.length / 2;

        return (
          <VertexLabel
            key={`rampmodifier-${arrayIndex}`}
            isActive={rampModifiers[arrayIndex]}
            position={v}
            color={'blue'}
            index={arrayIndex}
            onClick={handleModifierClick}
          />
        );
      })}
    </>
  );
};

// const getVertexBelow = (index: number): number => {
//   return 0;
// };

export default Grid;
