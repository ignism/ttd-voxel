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
  currentUISelection: 'ADD' | 'SUBTRACT' | null;
  setCurrentUISelection: (selection: 'ADD' | 'SUBTRACT' | null) => void;
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
      currentUISelection: null,
      setCurrentUISelection: (selection) => set(() => ({ currentUISelection: selection })),
    }),
    { name: 'Interface store' }
  )
);

const useInterfaceStore = createHook(interfaceStore);

export { interfaceStore, useInterfaceStore };
