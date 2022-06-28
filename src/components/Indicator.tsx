import { Box, Plane } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Intersection, Object3D, Vector3 } from 'three';
import { useClusterStore } from '../utilities/clusterStore';
import { BlockType } from './DebugBlock';

type IndicatorProps = {
  block: BlockType;
  onClick?: () => void;
};

const Indicator = ({ block, onClick }: IndicatorProps) => {
  const position = block.position.clone().add(new Vector3(0, 0.251, 0));

  return (
    // <Box position={position} args={[1, 0.01, 1]} onClick={onClick}>
    //   <meshBasicMaterial color={'green'} />
    // </Box>
    <Plane args={[0.8, 0.8]} position={position} rotation={[Math.PI * -0.5, 0, 0]}>
      <meshBasicMaterial color={'green'} />
    </Plane>
  );
};

export default Indicator;
