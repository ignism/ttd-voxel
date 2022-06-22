import { useEffect } from 'react';
import { useBlockStore } from '../utilities/blockStore';
import { useInterfaceStore } from '../utilities/interfaceStore';
import Block from './Block';
import BlockColliders from './BlockColliders';

type GridProps = {};

const Grid = () => {
  const { blocks } = useBlockStore();
  const { blockHovered } = useInterfaceStore();

  useEffect(() => {
    console.log('grid rendered');
  }, []);

  useEffect(() => {
    console.log('blocks rendered');
  }, [blocks]);

  return (
    <>
      {blocks.map((block) => {
        if (block.isActive) return <Block key={block.index} {...block} isDebugging={true} />;
      })}
      <BlockColliders />
    </>
  );
};

export default Grid;
