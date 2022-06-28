import { useEffect } from 'react';
import { useClusterStore } from '../utilities/clusterStore';
import { useInterfaceStore } from '../utilities/interfaceStore';
import Block, { BlockType } from './Block';
import BlockColliders from './BlockColliders';
import { Vector3 } from 'three';

type ClusterProps = {
  index?: number;
  position: Vector3;
  blocks: BlockType[];
};

export type ClusterType = {
  index: number;
  position: Vector3;
  blocks: BlockType[];
};

const Cluster = ({ position, blocks }: ClusterProps) => {
  // const { blocks } = useClusterStore();
  const { blockHovered } = useInterfaceStore();

  useEffect(() => {
    console.log('cluster rendered');
  }, []);

  return (
    <group position={position}>
      {blocks.map((block, index) => {
        if (block.isActive) {
          return <Block key={'block-' + block.index} {...block} isDebugging={false} />;
        }
      })}
      <BlockColliders />
    </group>
  );
};

export default Cluster;
