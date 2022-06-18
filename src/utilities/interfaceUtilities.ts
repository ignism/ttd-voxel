import { DragGesture } from '@use-gesture/vanilla';
import { throttle } from 'lodash';
import { Vector2 } from 'three';
import { interfaceStore } from './interfaceStore';

const initCanvasGestures = (canvas: HTMLCanvasElement) => {
  new DragGesture(
    canvas,
    throttle(({ active, movement }) => {
      const { isDragging, toggleDragging } = interfaceStore.getState();
      const distance = new Vector2(movement[0], movement[1]).length();

      if (active && distance > 10) {
        if (!isDragging) {
          toggleDragging(true);
        }
      } else {
        if (isDragging) {
          toggleDragging(false);
        }
      }
    }, 100)
  );
};

const handleBlockClick = (index: number) => {};

export { initCanvasGestures };
