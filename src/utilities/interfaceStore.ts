import { Intersection, Object3D, Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';

type InterfaceStore = {
  currentIntersection: Intersection | null;
  setCurrentIntersection: (intersection: Intersection | null) => void;
  clustersHovered: number[];
  addClusterHovered: (index: number) => void;
  removeClusterHovered: (index: number) => void;
  blocksHovered: { index: number; cluster: number; distance: number }[];
  addBlockHovered: (index: number, cluster: number, distance: number) => void;
  removeBlockHovered: (index: number, cluster: number) => void;
  blockHovered: { index: number; cluster: number; distance: number } | null;
  // setBlockHovered: (index: number | null, cluster?: number, distance?: number) => void;
  isDragging: boolean;
  toggleDragging: (toggle?: boolean) => void;
  currentUISelection: 'ADD' | 'SUBTRACT' | null;
  setCurrentUISelection: (selection: 'ADD' | 'SUBTRACT' | null) => void;
};

const interfaceStore = create<InterfaceStore>()(
  devtools(
    (set, get) => ({
      currentIntersection: null,

      setCurrentIntersection: (intersection) => set(() => ({ currentIntersection: intersection })),

      clustersHovered: [],

      addClusterHovered: (index) => {
        const currentClusters: number[] = [];

        get()
          .clustersHovered.concat(index)
          .forEach((cluster) => {
            if (!currentClusters.includes(cluster)) {
              currentClusters.push(cluster);
            }
          });

        set(() => ({ clustersHovered: currentClusters }));
      },

      removeClusterHovered: (index) => {
        const currentClusters: number[] = get().clustersHovered.filter((cluster) => index !== cluster);

        set(() => ({ clustersHovered: currentClusters }));
      },

      blocksHovered: [],

      addBlockHovered: (index, cluster, distance) => {
        const blocksHovered: { index: number; cluster: number; distance: number }[] = [];

        get()
          .blocksHovered.concat({ index, cluster, distance })
          .forEach((block) => {
            if (!blocksHovered.includes(block)) {
              blocksHovered.push(block);
            }
          });

        const blockHovered =
          blocksHovered.length > 0 ? blocksHovered.reduce((a, b) => (a.distance < b.distance ? a : b)) : null;

        set(() => ({ blocksHovered, blockHovered }));
      },

      removeBlockHovered: (index, cluster) => {
        const blocksHovered: { index: number; cluster: number; distance: number }[] = get().blocksHovered.filter(
          (block) => block.index !== index || block.cluster !== cluster
        );

        const blockHovered =
          blocksHovered.length > 0 ? blocksHovered.reduce((a, b) => (a.distance < b.distance ? a : b)) : null;

        set(() => ({ blocksHovered, blockHovered }));
      },

      blockHovered: null,

      isDragging: false,

      toggleDragging: (toggle) => set((state) => ({ isDragging: toggle === undefined ? !state.isDragging : toggle })),

      currentUISelection: null,

      setCurrentUISelection: (selection) => set(() => ({ currentUISelection: selection })),
    }),
    { name: 'Interface store' }
  )
);

const useInterfaceStore = createHook(interfaceStore);

export { interfaceStore, useInterfaceStore };
