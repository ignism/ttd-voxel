import { Instance, Instances } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { InstancedMesh, Object3D, Raycaster, Vector3 } from 'three';
import { useBlockStore } from '../utilities/blockStore';
import { getBlockIndexForInstanceId } from '../utilities/blockUtilities';
import { useInterfaceStore } from '../utilities/interfaceStore';
import { BlockType } from './Block';

type BlockColliderProps = {
  position: Vector3;
  index: number;
};

const BlockCollider = forwardRef<InstancedMesh, BlockColliderProps>(({ position, index }, ref) => {
  const { setBlockHovered } = useInterfaceStore();
  const { blocks } = useBlockStore();

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    console.log(blocks[index]);

    setBlockHovered(index);
  };

  return <Instance ref={ref} position={position} onPointerOver={handlePointerOver} />;
});

// type BlockCollidersProps = {
//   blocks: BlockType[];
// };

const BlockColliders = () => {
  const colliderRefs = useRef<InstancedMesh[]>([]);
  const { setBlockHovered, blockHovered } = useInterfaceStore();
  const { blocks } = useBlockStore();
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
    <Instances range={instances.length} visible={true} onPointerOut={() => console.log('leave instances')}>
      <boxBufferGeometry args={[1, 0.5, 1]} />
      <meshBasicMaterial color={'#44ff88'} wireframe={true} />
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