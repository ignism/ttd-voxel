import { Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';
import type { BlockType } from '../components/Block';
import {
  isBlockAtPosition,
  getBlockIndexForPosition,
  getBlockPositionForIndex,
  getNeighboursForPosition,
} from './blockUtilities';

const width = 3;
const height = 3;
const length = 3;

const initialBlocks: BlockType[] = Array.from({ length: width * height * length }).map((state, index) => {
  const position = getBlockPositionForIndex(index);
  const isActive = index < width * length;
  const neighbours = getNeighboursForPosition(position);

  return {
    index: index,
    isActive: isActive,
    position: position,
    vertices: Array.from({ length: 12 }).map(() => isActive),
    neighbours: neighbours,
  };
});

type BlockStore = {
  clusterSize: Vector3;
  blockSize: number;
  blocks: BlockType[];
  setBlock: (index: number, isActive: boolean) => void;
  // toggleVertex: (index: number, toggle?: boolean) => void;
  // toggleRampModifier: (index: number, toggle?: boolean) => void;
};

const blockStore = create<BlockStore>()(
  devtools(
    (set, get) => ({
      clusterSize: new Vector3(width, height, length),

      blockSize: 1,

      blocks: initialBlocks,

      setBlock: (index, isActive) => {
        const currentBlocks = get().blocks.slice();

        currentBlocks[index].isActive = isActive;
        currentBlocks[index].vertices = Array.from({ length: 12 }).map(() => isActive);

        set((state) => ({ blocks: currentBlocks }));
      },
    }),
    { name: 'Grid store' }
  )
);

const useBlockStore = createHook(blockStore);

export { blockStore, useBlockStore };
