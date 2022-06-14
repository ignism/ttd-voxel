import { Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';

type BlockStore = {
  size: Vector3;
  blocks: boolean[];
  vertices: boolean[];
  rampModifiers: boolean[];
  toggleBlock: (index: number, toggle?: boolean) => void;
  toggleVertex: (index: number, toggle?: boolean) => void;
  toggleRampModifier: (index: number, toggle?: boolean) => void;
};

const width = 3;
const height = 3;
const length = 3;

const blockStore = create<BlockStore>()(
  devtools(
    (set, get) => ({
      size: new Vector3(width, height, length),
      blocks: Array.from({ length: width * height * length }).map((state, index) => index < width * length),
      vertices: Array.from({ length: (width + 1) * (height + 1) * (length + 1) }).map(() => false),
      rampModifiers: [
        ...Array.from({ length: (width + 1) * height * length }).map(() => false),
        ...Array.from({ length: width * height * (length + 1) }).map(() => false),
      ],
      toggleBlock: (index, toggle) => {
        const currentBlocks = get().blocks.slice();

        currentBlocks[index] = toggle !== undefined ? toggle : !currentBlocks[index];

        set((state) => ({ blocks: currentBlocks }));
      },
      toggleVertex: (index, toggle) => {
        const currentVertices = get().vertices.slice();

        currentVertices[index] = toggle !== undefined ? toggle : !currentVertices[index];

        set((state) => ({ vertices: currentVertices }));
      },
      toggleRampModifier: (index, toggle) => {
        const currentModifiers = get().rampModifiers.slice();

        currentModifiers[index] = toggle !== undefined ? toggle : !currentModifiers[index];

        set((state) => ({ rampModifiers: currentModifiers }));
      },
    }),
    { name: 'Grid store' }
  )
);

const useBlockStore = createHook(blockStore);

export { blockStore, useBlockStore };
