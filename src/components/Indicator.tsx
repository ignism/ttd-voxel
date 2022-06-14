import { Box } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Intersection, Object3D, Vector3 } from 'three';
import { useBlockStore } from '../utilities/blockStore';

type IndicatorProps = {
  instanceId: number;
};

const Indicator = ({ instanceId }: IndicatorProps) => {
  const { size, blocks } = useBlockStore();

  let indexForId = 0;
  let counter = 0;

  blocks.forEach((block, index) => {
    if (block) {
      if (counter === instanceId) {
        indexForId = index;
      }
      counter++;
    }
  });

  const x = (indexForId % size.x) - size.x * 0.5;
  const y = Math.floor(indexForId / (size.x * size.z)) - size.y * 0.5;
  const z = (Math.floor(indexForId / size.x) % size.z) - size.z * 0.5;

  const position = new Vector3(x + 0.5, y + 1, z + 0.5);

  return (
    <Box position={position} args={[0.1, 0.1, 0.1]}>
      <meshBasicMaterial color={'white'} />
    </Box>
  );
};

export default Indicator;
