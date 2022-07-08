import { Plane } from '@react-three/drei';
import { Vector3 } from 'three';
import { getBlockWorldPositionForIndexAndParentCluster } from '../utilities/clusterUtilities';

import { BlockType } from './Block';

type IndicatorProps = {
  block: BlockType;
  onClick?: () => void;
};

const Indicator = ({ block, onClick }: IndicatorProps) => {
  const blockWorldPosition = getBlockWorldPositionForIndexAndParentCluster(block.index, block.parentCluster);
  const position = blockWorldPosition?.clone().add(new Vector3(0, 0.251, 0));

  return (
    <>
      {position && (
        <Plane args={[0.8, 0.8]} rotation={[Math.PI * -0.5, 0, 0]} {...{ position, onClick }}>
          <meshBasicMaterial color={'#000'} />
        </Plane>
      )}
    </>
  );
};

export default Indicator;
