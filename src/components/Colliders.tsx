import { Html, Instance, Instances } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { forwardRef, useRef } from 'react';
import { InstancedMesh, Vector3 } from 'three';
import { blockSize, clusterSize } from '../utilities/clusterUtilities';
import { useInterfaceStore } from '../utilities/interfaceStore';
import { BlockType } from './Block';

type BlockColliderProps = {
  index: number;
  position: Vector3;
  cluster: number;
};

const BlockCollider = forwardRef<InstancedMesh, BlockColliderProps>(({ index, position, cluster }, ref) => {
  const { addBlockHovered, removeBlockHovered } = useInterfaceStore();

  const handlePointerEnter = ({ distance }: ThreeEvent<PointerEvent>) => {
    addBlockHovered(index, cluster, distance);
  };

  const handlePointerLeave = (event: ThreeEvent<PointerEvent>) => {
    removeBlockHovered(index, cluster);
  };

  return (
    <Instance ref={ref} position={position} onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave} />
  );
});

type BlockCollidersProps = {
  blocks: BlockType[];
  cluster: number;
};

const BlockColliders = ({ blocks, cluster }: BlockCollidersProps) => {
  const colliderRefs = useRef<InstancedMesh[]>([]);
  // const { setBlockHovered, blockHovered } = useInterfaceStore();
  const instances: BlockType[] = [];

  blocks.forEach((block) => {
    if (block.isActive) {
      instances.push(block);
    }
  });

  // const raycaster = new Raycaster();

  // useFrame(({ camera, mouse }) => {
  //   raycaster.setFromCamera(mouse, camera);

  //   const currentIntersections = raycaster.intersectObjects(colliderRefs.current, false);

  //   if (currentIntersections.length === 0 && blockHovered) {
  //     setBlockHovered(null);
  //   }
  // });

  return (
    <Instances range={instances.length} visible={true}>
      <boxBufferGeometry args={[blockSize.x, blockSize.y, blockSize.z]} />
      <meshBasicMaterial color={'#44ff88'} wireframe={true} />
      {instances.map((block, index) => (
        <BlockCollider
          ref={(ref) => {
            if (ref) {
              colliderRefs.current[index] = ref;
            }
          }}
          key={`block-collider-${index}`}
          index={block.index}
          position={block.position}
          cluster={cluster}
        />
      ))}
    </Instances>
  );
};

type CollidersProps = {
  cluster: number;
  blocks: BlockType[];
};

const Colliders = ({ cluster, blocks }: CollidersProps) => {
  const { clustersHovered, addClusterHovered, removeClusterHovered } = useInterfaceStore();
  const clusterWorldSize = clusterSize.clone().multiply(blockSize);

  const handlePointerEnter = () => {
    addClusterHovered(cluster);
  };

  const handlePointerLeave = () => {
    removeClusterHovered(cluster);
  };

  return (
    <>
      <Html>
        <div>{cluster}</div>
      </Html>
      <mesh onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
        <boxBufferGeometry args={[clusterWorldSize.x, clusterWorldSize.y, clusterWorldSize.z]} />
        <meshBasicMaterial color={'#f4a'} wireframe={true} />
      </mesh>
      {clustersHovered.includes(cluster) && <BlockColliders {...{ blocks, cluster }} />}
    </>
  );
};

export default Colliders;
