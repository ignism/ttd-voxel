import { Instances, Instance } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { throttle } from 'lodash';
import { Object3D, Vector3 } from 'three';
import { useBlockStore } from '../utilities/blockStore';
import { useInterfaceStore } from '../utilities/interfaceStore';
import Pointer from './Pointer';

// type SceneProps = {
//   children: React.ReactNode;
// };

const BlockColliders = () => {
  const { blocks, size } = useBlockStore();

  const instances: Object3D[] = [];

  blocks.forEach((state, index) => {
    if (state) {
      const x = (index % size.x) - size.x * 0.5;
      const y = Math.floor(index / (size.x * size.z)) - size.y * 0.5;
      const z = (Math.floor(index / size.x) % size.z) - size.z * 0.5;

      const object = new Object3D();
      object.position.set(x + 0.5, y + 0.5, z + 0.5);
      object.updateMatrix();

      instances.push(object);
    }
  });

  console.log('🚀 ~ file: Scene.tsx ~ line 25 ~ blocks.forEach ~ instances', instances);

  return (
    <Instances range={instances.length}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={'#44ff88'} wireframe={true} />
      {instances.map((object, index) => (
        <BlockCollider key={`block-collider-${index}`} position={object.position} />
      ))}
    </Instances>
  );
};

const BlockCollider = ({ position }: { position: Vector3 }) => {
  const { setBlockHovered } = useInterfaceStore();

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setBlockHovered(null);
  };

  return (
    <group>
      <Instance position={position} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} />
    </group>
  );
};

const Scene = () => {
  const { blockHovered } = useInterfaceStore();
  const { blocks } = useBlockStore();

  return (
    <>
      {blockHovered && <Pointer position={blockHovered} />}
      <BlockColliders />
    </>
  );
};

export default Scene;
