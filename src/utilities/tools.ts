import { blockStore } from './blockStore';

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

export { getBlockIndexForInstanceId };
