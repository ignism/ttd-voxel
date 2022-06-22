import { Vector3 } from 'three';
import { BlockType } from '../components/Block';
import { blockStore } from './blockStore';

const clusterSize = new Vector3(1, 1, 1);

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

const isBlockBottomBlock = (index: number): boolean => {
  return getBlockArrayPositionForIndex(index).y === 0;
};

const getBlockArrayPositionForPosition = (position: Vector3): Vector3 => {
  const x = (clusterSize.x - 1) * 0.5;
  const y = (clusterSize.y - 1) * 0.5;
  const z = (clusterSize.z - 1) * 0.5;

  const offset = new Vector3(x, y, z);

  const arrayPosition = position.clone().multiply(new Vector3(1, 2, 1)).add(offset);

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
  const offset = (clusterSize.x - 1) * 0.5;
  const position = arrayPosition.clone().addScalar(-offset).multiply(new Vector3(1, 0.5, 1));

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

const getNeightbourVerticesForNeighboursInBlocks = (neighbours: number[], blocks: BlockType[]): boolean[] => {
  const currentNeighbourVertices: boolean[] = [];

  // left 0 2 4 6 8
  if (neighbours[0] >= 0) {
    currentNeighbourVertices.push(
      blocks[neighbours[0]].vertices[3],
      blocks[neighbours[0]].vertices[1],
      blocks[neighbours[0]].vertices[7],
      blocks[neighbours[0]].vertices[5],
      blocks[neighbours[0]].vertices[9]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  // right 3 1 7 5 9
  if (neighbours[1] >= 0) {
    currentNeighbourVertices.push(
      blocks[neighbours[1]].vertices[0],
      blocks[neighbours[1]].vertices[2],
      blocks[neighbours[1]].vertices[4],
      blocks[neighbours[1]].vertices[6],
      blocks[neighbours[1]].vertices[8]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  // back 1 0 5 4 10
  if (neighbours[2] >= 0) {
    currentNeighbourVertices.push(
      blocks[neighbours[2]].vertices[1],
      blocks[neighbours[2]].vertices[0],
      blocks[neighbours[2]].vertices[5],
      blocks[neighbours[2]].vertices[4],
      blocks[neighbours[2]].vertices[10]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  // front 2 3 6 7 11
  if (neighbours[3] >= 0) {
    currentNeighbourVertices.push(
      blocks[neighbours[3]].vertices[2],
      blocks[neighbours[3]].vertices[3],
      blocks[neighbours[3]].vertices[6],
      blocks[neighbours[3]].vertices[7],
      blocks[neighbours[3]].vertices[11]
    );
  } else {
    currentNeighbourVertices.push(false, false, false, false, false);
  }

  return currentNeighbourVertices;
};

const getBlockIndexForInstanceId = (instanceId: number): number => {
  const { blocks } = blockStore.getState();

  let indexForId = -1;
  let counter = 0;

  blocks.forEach((block, index) => {
    if (block) {
      if (counter === instanceId) {
        indexForId = index;
      }
      counter++;
    }
  });

  return indexForId;
};

export {
  clusterSize,
  isBlockAtPosition,
  isBlockBottomBlock,
  getBlockArrayPositionForPosition,
  getBlockArrayPositionForIndex,
  getBlockPositionForIndex,
  getBlockIndexForArrayPosition,
  getBlockIndexForPosition,
  getNeighboursForPosition,
  getNeightbourVerticesForNeighboursInBlocks,
  getBlockIndexForInstanceId,
};
