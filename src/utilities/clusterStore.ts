import { Vector3 } from 'three';
import createHook from 'zustand';
import { devtools } from 'zustand/middleware';
import create from 'zustand/vanilla';
import { BlockType } from '../components/Block';
import { ClusterType } from '../components/Cluster';
import {
  clusterSize,
  getBlockIndexForPosition,
  getBlockPositionForIndex,
  getClusterPositionForWorldPosition,
  getNeighboursForWorldPosition,
} from './clusterUtilities';

type ClusterStore = {
  clusters: ClusterType[];

  addCluster: (position: Vector3) => ClusterType;

  addBlock: (position: Vector3, vertices: boolean[]) => BlockType | null;

  addBlockForIndex: (index: number, vertices: boolean[], parentCluster: number) => void;

  calculateBlockNeighbours: (index: number, parentCluster: number) => void;
};

const clusterStore = create<ClusterStore>()(
  devtools(
    (set, get) => ({
      clusters: [],

      //

      addCluster: (position) => {
        const clusters = get().clusters.slice();

        const blocks = Array.from({ length: clusterSize.x * clusterSize.y * clusterSize.z }).map((block, index) => {
          const position = getBlockPositionForIndex(index);

          return {
            index: index,
            isActive: false,
            position: position,
            vertices: Array.from({ length: 12 }).map(() => false),
            neighbours: [null, null, null, null, null, null],
            parentCluster: clusters.length,
          };
        });

        const existingCluster = clusters.find((cluster) => cluster.position.equals(position));
        const cluster: ClusterType = existingCluster
          ? existingCluster
          : { index: clusters.length, position: position, blocks: blocks };

        clusters[cluster.index] = cluster;

        set(() => ({ clusters }));

        return cluster;
      },

      //

      addBlock: (position: Vector3, vertices: boolean[]) => {
        const clusterPosition = getClusterPositionForWorldPosition(position);
        const blockPosition = position.clone().sub(clusterPosition);
        const index = getBlockIndexForPosition(blockPosition);
        const currentClusters = get().clusters.slice();
        const parentCluster = currentClusters.find((cluster) => cluster.position.equals(clusterPosition))?.index;
        console.log('🚀 ~ file: clusterStore.ts ~ line 70 ~ parentCluster', parentCluster);

        if (parentCluster !== undefined) {
          console.log('🚀 ~ file: clusterStore.ts ~ line 72 ~ parentCluster', parentCluster);
          const currentBlocks = currentClusters[parentCluster].blocks.slice();
          // const position = getBlockPositionForIndex(index);
          // const worldPosition = currentClusters[parentCluster].position.clone().add(position);

          const block: BlockType = {
            index: index,
            isActive: true,
            neighbours: [null, null, null, null, null, null],
            parentCluster: parentCluster,
            vertices: vertices,
            position: getBlockPositionForIndex(index),
          };

          currentBlocks[index] = block;
          currentClusters[parentCluster].blocks = currentBlocks;

          set(() => ({ clusters: currentClusters }));
        }

        return null;
      },

      //

      addBlockForIndex: (index, vertices, parentCluster) => {
        const currentClusters = get().clusters.slice();

        if (currentClusters.find(({ index }) => index === parentCluster)) {
          const currentBlocks = currentClusters[parentCluster].blocks.slice();
          const position = getBlockPositionForIndex(index);
          const worldPosition = currentClusters[parentCluster].position.clone().add(position);

          const block: BlockType = {
            index: index,
            isActive: true,
            neighbours: [null, null, null, null, null, null],
            parentCluster: parentCluster,
            vertices: vertices,
            position: getBlockPositionForIndex(index),
          };

          currentBlocks[index] = block;
          currentClusters[parentCluster].blocks = currentBlocks;

          set(() => ({ clusters: currentClusters }));
        }
      },

      //

      // https://discord.com/channels/740090768164651008/740093228904218657/992930374520934482
      calculateBlockNeighbours: (index, parentCluster) => {
        const clusters = get().clusters.slice();

        const cluster = clusters.find(({ index }) => index === parentCluster);

        if (cluster) {
          const blocks = cluster.blocks.slice();
          const position = getBlockPositionForIndex(index);
          const worldPosition = clusters[parentCluster].position.clone().add(position);
          blocks[index].neighbours = getNeighboursForWorldPosition(worldPosition);
          // cluster.blocks = blocks;
          // set(() => ({ clusters: currentClusters }));
        }
      },
    }),
    { name: 'Cluster store' }
  )
);

const useClusterStore = createHook(clusterStore);

export { clusterStore, useClusterStore };
