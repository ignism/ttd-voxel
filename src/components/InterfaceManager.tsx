import { useEffect, useState } from 'react';
import { Vector3 } from 'three';
import { useBlockStore } from '../utilities/blockStore';
import { interfaceStore, useInterfaceStore } from '../utilities/interfaceStore';
import { getBlockIndexForInstanceId } from '../utilities/tools';
import Indicator from './Indicator';

type InterfaceManagerProps = {};

const InterfaceManager = ({}: InterfaceManagerProps) => {
  const { size, toggleBlock } = useBlockStore();
  const { currentIntersection } = useInterfaceStore();

  const handlePointerUp = ({ button, preventDefault }: PointerEvent) => {
    const { currentIntersection } = interfaceStore.getState();

    if (currentIntersection?.instanceId) {
      const index = getBlockIndexForInstanceId(currentIntersection.instanceId);
      const indexAbove = index + size.x * size.z;

      if (button === 0 && indexAbove < size.x * size.y * size.z) {
        toggleBlock(indexAbove);
      } else if (button === 2) {
        toggleBlock(index);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <>{currentIntersection?.instanceId !== undefined && <Indicator instanceId={currentIntersection.instanceId} />}</>
  );
};

export default InterfaceManager;
