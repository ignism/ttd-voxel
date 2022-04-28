import { Vector3 } from 'three';

type BlockType = {
  position: Vector3;
  shape: number;
  material?: string;
};

type BlockProps = {
  position: Vector3;
};

const Block = ({ position }: BlockProps) => {
  return <></>;
};

export default Block;
