import { Html } from '@react-three/drei';
import { useBlockStore } from '../utilities/blockStore';
import { useInterfaceStore } from '../utilities/interfaceStore';
import Indicator from './Indicator';
import { TbCircleMinus, TbCirclePlus } from 'react-icons/tb';

type InterfaceManagerProps = {};

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

const InterfaceManager = ({}: InterfaceManagerProps) => {
  const { blocks, setBlock } = useBlockStore();
  const { blockHovered, setBlockHovered, currentUISelection, setCurrentUISelection } = useInterfaceStore();

  const handlePlusClick = () => {
    setCurrentUISelection('ADD');
  };

  const handleMinusClick = () => {
    setCurrentUISelection('SUBTRACT');
  };

  const handleIndicatorClick = () => {
    switch (currentUISelection) {
      case 'ADD':
        if (blockHovered !== null) {
          const topIndex = blocks[blockHovered].neighbours[5];
          if (topIndex >= 0) {
            setBlock(topIndex, true);
            setBlockHovered(null);
          }
        }
        break;
      case 'SUBTRACT':
        if (blockHovered !== null) {
          setBlock(blockHovered, false);
          setBlockHovered(null);
        }
        break;
    }
  };

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
      {/* {blockHovered !== null && <Indicator block={blocks[blockHovered]} onClick={handleIndicatorClick} />} */}
    </>
  );
};

export default InterfaceManager;
