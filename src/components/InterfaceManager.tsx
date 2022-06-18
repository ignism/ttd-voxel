import { useBlockStore } from '../utilities/blockStore';
import { useInterfaceStore } from '../utilities/interfaceStore';
import Indicator from './Indicator';

type InterfaceManagerProps = {};

const InterfaceManager = ({}: InterfaceManagerProps) => {
  const { blocks } = useBlockStore();
  const { blockHovered } = useInterfaceStore();

  return <>{blockHovered !== null && <Indicator block={blocks[blockHovered]} />}</>;
};

export default InterfaceManager;
