import { Box } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Intersection, Object3D, Vector3 } from 'three';
import { useBlockStore } from '../utilities/blockStore';
import { BlockType } from './Block';

type IndicatorProps = {
  block: BlockType;
};

const Indicator = ({ block }: IndicatorProps) => {
  const { setBlock } = useBlockStore();

  const handleClick = () => {
    setBlock(block.index, false);
  };

  return (
    <Box position={block.position} args={[1.01, 0.51, 1.01]} onClick={handleClick}>
      <meshBasicMaterial color={'white'} />
    </Box>
  );
};

export default Indicator;
