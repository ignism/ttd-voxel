import { useEffect } from 'react';
import { Vector3 } from 'three';
import { useInterfaceStore } from '../utilities/interfaceStore';
import Block, { BlockType } from './Block';
import Colliders from './Colliders';

type ClusterProps = {
  index: number;
  position: Vector3;
  blocks: BlockType[];
};

export type ClusterType = {
  index: number;
  position: Vector3;
  blocks: BlockType[];
};

const Cluster = ({ index, position, blocks }: ClusterProps) => {
  const { blockHovered } = useInterfaceStore();

  useEffect(() => {
    if (index === 0) {
      // console.log(blocks);
    }
  }, []);

  return (
    <group position={position}>
      {blocks.map((block, index) => {
        if (block.isActive) {
          return <Block key={'block-' + block.index} {...block} isDebugging={false} />;
        }
      })}
      <Colliders cluster={index} blocks={blocks} />
      {/* <BlockColliders blocks={blocks} /> */}
    </group>
  );
};

export default Cluster;
