import { Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';
import { ClusterType } from '../components/Cluster';
import type { BlockType } from '../components/DebugBlock';
import {
  clusterSize,
  getBlockPositionForIndex,
  getClusterPositionForIndex,
  getNeighboursForPosition,
  isBlockBottomBlock,
  worldSize,
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

const initialClusters: ClusterType[] = Array.from({ length: worldSize.x * worldSize.y * worldSize.z }).map(
  (state, index) => ({
    index: index,
    position: getClusterPositionForIndex(index),
    blocks: initialBlocks,
  })
);

type ClusterStore = {
  clusterSize: Vector3;
  clusters: ClusterType[];
  setCluster: (index: number, blocks: BlockType[], position: Vector3) => void;
  blocks: BlockType[];
  setBlock: (index: number, isActive: boolean) => void;
};

const clusterStore = create<ClusterStore>()(
  devtools(
    (set, get) => ({
      clusterSize: new Vector3(clusterSize.x, clusterSize.y, clusterSize.z),

      blockSize: 1,

      clusters: initialClusters,

      setCluster: (index, blocks, position) => {},

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
    { name: 'Cluster store' }
  )
);

const useClusterStore = createHook(clusterStore);

export { clusterStore, useClusterStore };
