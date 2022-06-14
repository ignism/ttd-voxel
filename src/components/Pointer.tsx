import { Plane } from '@react-three/drei';
import { Vector3 } from 'three';

type PointerProps = {
  position: Vector3;
};

const Pointer = ({ position }: PointerProps) => {
  const toTop = new Vector3(0, 0.5, 0);

  return <Plane args={[1, 1]} position={position.add(toTop)} rotation={[-Math.PI * 0.5, 0, 0]} />;
};

export default Pointer;
