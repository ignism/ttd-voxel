import { Html } from '@react-three/drei';
import { TbCircleMinus, TbCirclePlus } from 'react-icons/tb';
import { Vector3 } from 'three';
import { useClusterStore } from '../utilities/clusterStore';
import {
  blockSize,
  getBlockIndexForPosition,
  getBlockWorldPositionForIndexAndParentCluster,
  getClusterPositionForWorldPosition,
} from '../utilities/clusterUtilities';
import { useInterfaceStore } from '../utilities/interfaceStore';
import Indicator from './Indicator';

type UIButtonProps = {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
};

const UIButton = ({ isActive, onClick, children }: UIButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center w-10 h-8 mt-4 ml-4 font-bold rounded-lg text-slate-800 ${
        isActive ? 'bg-teal-400' : 'bg-slate-500'
      } hover:bg-slate-200`}
    >
      {children}
    </div>
  );
};

const InterfaceManager = () => {
  const clusters = useClusterStore((state) => state.clusters);
  const addBlockForIndex = useClusterStore((state) => state.addBlockForIndex);
  const addBlock = useClusterStore((state) => state.addBlock);
  const { blockHovered, currentUISelection, setCurrentUISelection } = useInterfaceStore();

  const handlePlusClick = () => {
    setCurrentUISelection('ADD');
  };

  const handleMinusClick = () => {
    setCurrentUISelection('SUBTRACT');
  };

  const handleIndicatorClick = () => {
    switch (currentUISelection) {
      case 'ADD':
        if (blockHovered) {
          let position = getBlockWorldPositionForIndexAndParentCluster(blockHovered.index, blockHovered.cluster);

          // TODO, fix adding block crashes cluster store.
          if (position) {
            position.add(new Vector3(0, blockSize.y, 0));
            const clusterPosition = getClusterPositionForWorldPosition(position);
            const blockPosition = position.clone().sub(clusterPosition);
            const index = getBlockIndexForPosition(blockPosition);
            console.log('🚀 ~ file: InterfaceManager.tsx ~ line 55 ~ handleIndicatorClick ~ index', index);
            const parentCluster = clusters.find((cluster) => cluster.position.equals(clusterPosition))?.index;
            console.log(
              '🚀 ~ file: InterfaceManager.tsx ~ line 56 ~ handleIndicatorClick ~ parentCluster',
              parentCluster
            );

            if (parentCluster !== undefined) {
              addBlockForIndex(
                index,
                Array.from({ length: 12 }).map(() => true),
                parentCluster
              );
            }

            // addBlockForIndex()

            // addBlock(
            //   position,
            //   Array.from({ length: 12 }).map(() => true)
            // );
            // const block = addBlock(
            //   position,
            //   Array.from({ length: 12 }).map(() => true)
            // );
            if (block) {
              // calculateBlockNeighbours(block.index, block.parentCluster);
              // block.neighbours.forEach((neighbour) => {
              //   if (neighbour) {
              //     calculateBlockNeighbours(neighbour.index, neighbour.parentCluster);
              //   }
              // });
            }
          }
        }
        break;
      case 'SUBTRACT':
        if (blockHovered !== null) {
          // setBlock(blockHovered, false);
          // setBlockHovered(null);
        }
        break;
    }
  };

  const block = blockHovered
    ? clusters.find((cluster) => cluster.index === blockHovered?.cluster)?.blocks[blockHovered.index]
    : null;

  return (
    <>
      <Html fullscreen>
        <div className="flex justify-start w-full h-screen">
          <UIButton isActive={currentUISelection === 'ADD'} onClick={handlePlusClick}>
            <TbCirclePlus className="w-6 h-6" />
          </UIButton>
          <UIButton isActive={currentUISelection === 'SUBTRACT'} onClick={handleMinusClick}>
            <TbCircleMinus className="w-6 h-6" />
          </UIButton>
        </div>
      </Html>
      {block && <Indicator block={block} onClick={handleIndicatorClick} />}
    </>
  );
};

export default InterfaceManager;
