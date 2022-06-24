import { Instance, Instances } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { InstancedMesh, Object3D, Raycaster, Vector3 } from 'three';
import { useClusterStore } from '../utilities/clusterStore';
import { getBlockIndexForInstanceId } from '../utilities/clusterUtilities';
import { useInterfaceStore } from '../utilities/interfaceStore';
import { BlockType } from './Block';

type BlockColliderProps = {
  position: Vector3;
  index: number;
};

const BlockCollider = forwardRef<InstancedMesh, BlockColliderProps>(({ position, index }, ref) => {
  const { setBlockHovered } = useInterfaceStore();
  const { blocks } = useClusterStore();

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (blocks[index].neighbours[5] >= 0) {
      if (!blocks[blocks[index].neighbours[5]].isActive) {
        setBlockHovered(index);
      }
    } else {
      setBlockHovered(index);
    }
  };

  return <Instance ref={ref} position={position} onPointerOver={handlePointerOver} />;
});

// type BlockCollidersProps = {
//   blocks: BlockType[];
// };

const BlockColliders = () => {
  const colliderRefs = useRef<InstancedMesh[]>([]);
  const { setBlockHovered, blockHovered } = useInterfaceStore();
  const { blocks } = useClusterStore();
  const instances: BlockType[] = [];

  blocks.forEach((block) => {
    if (block.isActive) {
      // const object = new Object3D();

      // object.position.set(position.x, position.y, position.z);
      // object.updateMatrix();

      instances.push(block);
    }
  });

  const raycaster = new Raycaster();

  useFrame(({ camera, mouse }) => {
    raycaster.setFromCamera(mouse, camera);

    const currentIntersections = raycaster.intersectObjects(colliderRefs.current, false);

    if (currentIntersections.length === 0 && blockHovered) {
      setBlockHovered(null);
    }
  });

  useEffect(() => {
    console.log('colliders rendered');
  });

  return (
    <Instances range={instances.length} visible={false} onPointerOut={() => console.log('leave instances')}>
      <boxBufferGeometry args={[1, 0.5, 1]} />
      <meshStandardMaterial color={'#44ff88'} wireframe={false} />
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

BlockColliders.whyDidYouRender = true;

export default BlockColliders;
