import { Vector3 } from 'three';
import { BlockType } from '../components/Block';
import { clusterStore } from './clusterStore';

const worldSize = new Vector3(2, 2, 2);
const clusterSize = new Vector3(4, 4, 4);
const blockSize = new Vector3(1, 0.5, 1);

const isBlockAtPosition = (position: Vector3): boolean => {
  if (position.x < 0 || position.x > clusterSize.x - 1) {
    return false;
  }
  if (position.y < 0 || position.y > clusterSize.y - 1) {
    return false;
  }
  if (position.z < 0 || position.z > clusterSize.z - 1) {
    return false;
  }

  return true;
};

const getClusterPositionForWorldPosition = (position: Vector3, debug?: boolean): Vector3 => {
  const clusterWorldSize = clusterSize.clone().multiply(blockSize);
  const clusterOffset = clusterWorldSize.clone().divideScalar(2);
  const worldOffset = worldSize.clone().divideScalar(2);
  const clusterPosition = position
    .clone()
    .divide(clusterWorldSize)
    .add(worldOffset)
    .floor()
    .addScalar(0.5)
    .sub(worldOffset)
    .multiply(clusterWorldSize);

  if (debug) {
    console.log('');
    console.log('clusterWorldSize', clusterWorldSize);
    console.log('clusterOffset', clusterOffset);
    console.log('worldOffset', worldOffset);
    console.log('position', position);
    console.log('clusterPosition', clusterPosition);
    console.log('');
  }

  return clusterPosition;
};

const getBlockArrayPositionForPosition = (position: Vector3): Vector3 => {
  const x = (clusterSize.x - 1) * 0.5;
  const y = (clusterSize.y - 1) * 0.5;
  const z = (clusterSize.z - 1) * 0.5;

  const offset = new Vector3(x, y, z);

  const arrayPosition = position.clone().divide(blockSize).add(offset);

  return arrayPosition;
};

const getBlockArrayPositionForIndex = (index: number): Vector3 => {
  const x = index % clusterSize.x;
  const y = Math.floor(index / (clusterSize.x * clusterSize.z));
  const z = Math.floor(index / clusterSize.x) % clusterSize.z;

  const arrayPosition = new Vector3(x, y, z);

  return arrayPosition;
};

const getBlockPositionForIndex = (index: number): Vector3 => {
  const arrayPosition = getBlockArrayPositionForIndex(index);

  const x = (clusterSize.x - 1) * 0.5;
  const y = (clusterSize.y - 1) * 0.5;
  const z = (clusterSize.z - 1) * 0.5;
  const offset = new Vector3(x, y, z);

  const position = arrayPosition.clone().sub(offset).multiply(blockSize);

  return position;
};

const getBlockWorldPositionForIndexAndParentCluster = (index: number, parentCluster: number): Vector3 | null => {
  const { clusters } = clusterStore.getState();

  const cluster = clusters.find((cluster) => cluster.index === parentCluster);

  if (cluster) {
    const worldPosition = cluster.position.clone().add(cluster.blocks[index].position);
  }

  return cluster ? cluster.position.clone().add(cluster.blocks[index].position) : null;
};

const getClusterArrayPositionForIndex = (index: number): Vector3 => {
  const x = index % worldSize.x;
  const y = Math.floor(index / (worldSize.x * worldSize.z));
  const z = Math.floor(index / worldSize.x) % worldSize.z;

  const arrayPosition = new Vector3(x, y, z);

  return arrayPosition;
};

const getClusterPositionForIndex = (index: number): Vector3 => {
  const arrayPosition = getClusterArrayPositionForIndex(index);

  const x = (worldSize.x - 1) * 0.5;
  const y = (worldSize.y - 1) * 0.5;
  const z = (worldSize.z - 1) * 0.5;
  const offset = new Vector3(x, y, z);

  const position = arrayPosition.clone().sub(offset).multiply(clusterSize).multiply(blockSize);

  return position;
};

const getBlockIndexForArrayPosition = (arrayPosition: Vector3) => {
  const x = arrayPosition.x;
  const y = arrayPosition.y * clusterSize.x * clusterSize.z;
  const z = arrayPosition.z * clusterSize.x;

  const index = x + y + z;

  return index;
};

const getBlockIndexForPosition = (position: Vector3) => {
  const arrayPosition = getBlockArrayPositionForPosition(position);
  const index = getBlockIndexForArrayPosition(arrayPosition);

  return index;
};

const getNeighboursForPosition = (position: Vector3) => {
  const arrayPosition = getBlockArrayPositionForPosition(position);

  const left = arrayPosition.clone().add(new Vector3(-1, 0, 0));
  const right = arrayPosition.clone().add(new Vector3(1, 0, 0));
  const back = arrayPosition.clone().add(new Vector3(0, 0, -1));
  const front = arrayPosition.clone().add(new Vector3(0, 0, 1));
  const bottom = arrayPosition.clone().add(new Vector3(0, -1, 0));
  const top = arrayPosition.clone().add(new Vector3(0, 1, 0));

  const leftIndex = isBlockAtPosition(left) ? getBlockIndexForArrayPosition(left) : -1;
  const rightIndex = isBlockAtPosition(right) ? getBlockIndexForArrayPosition(right) : -1;
  const backIndex = isBlockAtPosition(back) ? getBlockIndexForArrayPosition(back) : -1;
  const frontIndex = isBlockAtPosition(front) ? getBlockIndexForArrayPosition(front) : -1;
  const bottomIndex = isBlockAtPosition(bottom) ? getBlockIndexForArrayPosition(bottom) : -1;
  const topIndex = isBlockAtPosition(top) ? getBlockIndexForArrayPosition(top) : -1;

  return [leftIndex, rightIndex, backIndex, frontIndex, bottomIndex, topIndex];
};

const getBlockForWorldPosition = (position: Vector3, debug?: boolean): BlockType | null => {
  const { clusters } = clusterStore.getState();
  const clusterPosition = getClusterPositionForWorldPosition(position, debug);
  const blockPosition = position.clone().sub(clusterPosition);
  const cluster = clusters.find((cluster) => cluster.position.equals(clusterPosition));

  const block = cluster?.blocks.find((block) => block.position.equals(blockPosition));

  return block ? block : null;
};

const getNeighboursForWorldPosition = (position: Vector3): (BlockType | null)[] => {
  const leftPosition = position.clone().add(new Vector3(-blockSize.x, 0, 0));
  const rightPosition = position.clone().add(new Vector3(blockSize.x, 0, 0));
  const backPosition = position.clone().add(new Vector3(0, 0, -blockSize.z));
  const frontPosition = position.clone().add(new Vector3(0, 0, blockSize.z));
  const bottomPosition = position.clone().add(new Vector3(0, -blockSize.y, 0));
  const topPosition = position.clone().add(new Vector3(0, blockSize.y, 0));

  return [
    getBlockForWorldPosition(leftPosition),
    getBlockForWorldPosition(rightPosition),
    getBlockForWorldPosition(backPosition),
    getBlockForWorldPosition(frontPosition),
    getBlockForWorldPosition(bottomPosition),
    getBlockForWorldPosition(topPosition),
  ];
};

const getNeightbourVerticesForNeighboursInBlocks = (neighbours: (BlockType | null)[]): boolean[] => {
  const currentNeighbourVertices: boolean[] = [];

  // left 0 2 4 6 8
  if (neighbours[0]) {
    currentNeighbourVertices.push(
      neighbours[0].vertices[3],
      neighbours[0].vertices[1],
      neighbours[0].vertices[7],
      neighbours[0].vertices[5],
      neighbours[0].vertices[9]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  // right 3 1 7 5 9
  if (neighbours[1]) {
    currentNeighbourVertices.push(
      neighbours[1].vertices[0],
      neighbours[1].vertices[2],
      neighbours[1].vertices[4],
      neighbours[1].vertices[6],
      neighbours[1].vertices[8]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  // back 1 0 5 4 10
  if (neighbours[2]) {
    currentNeighbourVertices.push(
      neighbours[2].vertices[1],
      neighbours[2].vertices[0],
      neighbours[2].vertices[5],
      neighbours[2].vertices[4],
      neighbours[2].vertices[10]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  // front 2 3 6 7 11
  if (neighbours[3]) {
    currentNeighbourVertices.push(
      neighbours[3].vertices[2],
      neighbours[3].vertices[3],
      neighbours[3].vertices[6],
      neighbours[3].vertices[7],
      neighbours[3].vertices[11]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  return currentNeighbourVertices;
};

const calculateBlockNeighbours = (index: number, parentCluster: number) => {
  const { clusters } = clusterStore.getState();

  const cluster = clusters.find(({ index }) => index === parentCluster);

  if (cluster) {
    const blocks = cluster.blocks.slice();
    const position = getBlockPositionForIndex(index);
    const worldPosition = clusters[parentCluster].position.clone().add(position);
    blocks[index].neighbours = getNeighboursForWorldPosition(worldPosition);
    cluster.blocks = blocks;
    // set(() => ({ clusters: currentClusters }));
  }
};

export {
  worldSize,
  clusterSize,
  blockSize,
  // isBlockAtPosition,
  getClusterPositionForWorldPosition,
  getClusterPositionForIndex,
  // getClusterArrayPositionForIndex,
  // getBlockArrayPositionForPosition,
  // getBlockArrayPositionForIndex,
  getBlockPositionForIndex,
  // getBlockIndexForArrayPosition,
  getBlockIndexForPosition,
  getBlockWorldPositionForIndexAndParentCluster,
  // getNeighboursForPosition,
  getNeighboursForWorldPosition,
  getNeightbourVerticesForNeighboursInBlocks,
  calculateBlockNeighbours,
};
