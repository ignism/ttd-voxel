import { Intersection, Object3D, Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';

type InterfaceStore = {
  currentIntersection: Intersection | null;
  setCurrentIntersection: (intersection: Intersection | null) => void;
  blockHovered: number | null;
  setBlockHovered: (block: number | null) => void;
  isDragging: boolean;
  toggleDragging: (toggle?: boolean) => void;
};

const interfaceStore = create<InterfaceStore>()(
  devtools(
    (set, get) => ({
      currentIntersection: null,
      setCurrentIntersection: (intersection) => set(() => ({ currentIntersection: intersection })),
      blockHovered: null,
      setBlockHovered: (block) => set(() => ({ blockHovered: block })),
      isDragging: false,
      toggleDragging: (toggle) => set((state) => ({ isDragging: toggle === undefined ? !state.isDragging : toggle })),
    }),
    { name: 'Interface store' }
  )
);

const useInterfaceStore = createHook(interfaceStore);

export { interfaceStore, useInterfaceStore };
