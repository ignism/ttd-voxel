import { Vector3 } from 'three';
import { blockStore } from './blockStore';

const clusterSize = new Vector3(3, 3, 3);

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

const getBlockPositionForIndex = (index: number) => {
  const x = index % clusterSize.x;
  const y = Math.floor(index / (clusterSize.x * clusterSize.z));
  const z = Math.floor(index / clusterSize.x) % clusterSize.z;

  const arrayPosition = new Vector3(x, y, z);
  const offset = (clusterSize.x - 1) * 0.5;
  const position = arrayPosition.clone().addScalar(-offset).multiply(new Vector3(1, 0.5, 1));

  return position;
};

const getBlockIndexForPosition = (position: Vector3) => {
  const offset = (clusterSize.x - 1) * 0.5;
  const arrayPosition = position.clone().multiply(new Vector3(1, 2, 1)).addScalar(offset);

  const x = arrayPosition.x;
  const y = arrayPosition.y * clusterSize.x * clusterSize.z;
  const z = arrayPosition.z * clusterSize.x;

  const index = x + y + z;

  return index;
};

const getBlockIndexForArrayPosition = (arrayPosition: Vector3) => {
  const x = arrayPosition.x;
  const y = arrayPosition.y * clusterSize.x * clusterSize.z;
  const z = arrayPosition.z * clusterSize.x;

  const index = x + y + z;

  return index;
};

const getNeighboursForPosition = (position: Vector3) => {
  const offset = (clusterSize.x - 1) * 0.5;
  const arrayPosition = position.clone().multiply(new Vector3(1, 2, 1)).addScalar(offset);

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
  getBlockIndexForInstanceId,
  isBlockAtPosition,
  getBlockPositionForIndex,
  getBlockIndexForPosition,
  getNeighboursForPosition,
};
