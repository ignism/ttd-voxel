import { Html } from '@react-three/drei';
import { Vector3 } from 'three';

type VertexLabelProps = {
  position: Vector3;
  index: number;
  isActive: boolean;
  color: string;
};

const VertexLabel = ({ color, position, index, isActive }: VertexLabelProps) => {
  return (
    <Html position={position}>
      <div
        className={`rounded-full ${
          !isActive ? 'bg-slate-400' : color
        }  text-black -ml-2 -mt-2 w-4 h-4 text-xs select-none flex justify-center items-center`}
      >
        {index}
      </div>
    </Html>
  );
};

export default VertexLabel;
