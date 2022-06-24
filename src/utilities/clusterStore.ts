import { Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';
import type { BlockType } from '../components/Block';
import {
  clusterSize,
  isBlockAtPosition,
  getBlockIndexForPosition,
  getBlockPositionForIndex,
  getNeighboursForPosition,
  getBlockArrayPositionForIndex,
  isBlockBottomBlock,
} from './clusterUtilities';

const initialBlocks: BlockType[] = Array.from({ length: clusterSize.x * clusterSize.y * clusterSize.z }).map(
  (state, index) => {
    const position = getBlockPositionForIndex(index);
    const isActive = index < clusterSize.x * clusterSize.z;
    const neighbours = getNeighboursForPosition(position);

    return {
      index: index,
      isActive: isActive,
      position: position,
      vertices: Array.from({ length: 12 }).map(() => isActive),
      neighbours: neighbours,
    };
  }
);

type BlockStore = {
  clusterSize: Vector3;
  blockSize: number;
  blocks: BlockType[];
  setBlock: (index: number, isActive: boolean) => void;
};

const clusterStore = create<BlockStore>()(
  devtools(
    (set, get) => ({
      clusterSize: new Vector3(clusterSize.x, clusterSize.y, clusterSize.z),

      blockSize: 1,

      blocks: initialBlocks,

      setBlock: (index, isActive) => {
        if (!isBlockBottomBlock(index)) {
          const currentBlocks = get().blocks.slice();

          currentBlocks[index].isActive = isActive;
          currentBlocks[index].vertices = Array.from({ length: 12 }).map(() => isActive);

          set((state) => ({ blocks: currentBlocks }));
        } else {
          console.log(`error, ${index} is bottomblock`);
        }
      },
    }),
    { name: 'Grid store' }
  )
);

const useClusterStore = createHook(clusterStore);

export { clusterStore, useClusterStore };
