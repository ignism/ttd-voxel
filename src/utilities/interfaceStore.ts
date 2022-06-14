import { Intersection, Object3D, Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';

type InterfaceStore = {
  currentIntersection: Intersection | null;
  setCurrentIntersection: (intersection: Intersection | null) => void;
  blockHovered: Vector3 | null;
  setBlockHovered: (block: Vector3 | null) => void;
};

const interfaceStore = create<InterfaceStore>()(
  devtools(
    (set, get) => ({
      currentIntersection: null,
      setCurrentIntersection: (intersection) => set((state) => ({ currentIntersection: intersection })),
      blockHovered: null,
      setBlockHovered: (block) => set((state) => ({ blockHovered: block })),
    }),
    { name: 'Interface store' }
  )
);

const useInterfaceStore = createHook(interfaceStore);

export { interfaceStore, useInterfaceStore };
