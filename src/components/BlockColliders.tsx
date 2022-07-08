import { Instance, Instances } from '@react-three/drei';
import { forwardRef, useRef } from 'react';
import { InstancedMesh, Vector3 } from 'three';
import { BlockType } from './Block';

type BlockColliderProps = {
  position: Vector3;
  index: number;
};

const BlockCollider = forwardRef<InstancedMesh, BlockColliderProps>(({ position, index }, ref) => {
  // const { setBlockHovered } = useInterfaceStore();
  // const { blocks } = useClusterStore();

  // const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
  //   event.stopPropagation();

  //   if (blocks[index].neighbours[5] >= 0) {
  //     if (!blocks[blocks[index].neighbours[5]].isActive) {
  //       setBlockHovered(index);
  //     }
  //   } else {
  //     setBlockHovered(index);
  //   }
  // };

  return <Instance ref={ref} position={position} />;
});

type BlockCollidersProps = {
  blocks: BlockType[];
};

const BlockColliders = ({ blocks }: BlockCollidersProps) => {
  const colliderRefs = useRef<InstancedMesh[]>([]);
  const instances: BlockType[] = [];

  blocks.forEach((block) => {
    if (block.isActive) {
      instances.push(block);
    }
  });

  return (
    <Instances range={instances.length} visible={true}>
      <boxBufferGeometry args={[1, 0.5, 1]} />
      <meshStandardMaterial color={'#44ff88'} wireframe={true} />
      {instances.map((block, index) => (
        <BlockCollider
          ref={(ref) => {
            if (ref) {
              colliderRefs.current[index] = ref;
            }
          }}
          index={block.index}
          key={`block-collider-${index}`}
          position={block.position}
        />
      ))}
    </Instances>
  );
};

export default BlockColliders;
