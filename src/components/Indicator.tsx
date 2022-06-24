import { Box } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Intersection, Object3D, Vector3 } from 'three';
import { useClusterStore } from '../utilities/clusterStore';
import { BlockType } from './DebugBlock';

type IndicatorProps = {
  block: BlockType;
  onClick?: () => void;
};

const Indicator = ({ block, onClick }: IndicatorProps) => {
  const position = block.position.clone().add(new Vector3(0, 0.25, 0));

  return (
    <Box position={position} args={[1.01, 0.01, 1.01]} onClick={onClick}>
      <meshBasicMaterial color={'white'} />
    </Box>
  );
};

export default Indicator;
