import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import Cluster from './components/Cluster';
import InterfaceManager from './components/InterfaceManager';
import { useClusterStore } from './utilities/clusterStore';
import {
  clusterSize,
  getClusterPositionForIndex,
  worldSize,
  calculateBlockNeighbours,
} from './utilities/clusterUtilities';
import { initCanvasGestures } from './utilities/interfaceUtilities';

// FIXME: ClusterStore
// TODO: Rerender clusters when blocks are updated

const App = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const clusters = useClusterStore((state) => state.clusters);
  const addCluster = useClusterStore((state) => state.addCluster);
  const addBlockForIndex = useClusterStore((state) => state.addBlockForIndex);
  const [renderTicker, setRenderTicker] = useState(0);

  useEffect(() => {
    if (canvas.current) {
      initCanvasGestures(canvas.current);
    }

    const clusters = Array.from({ length: worldSize.x * worldSize.y * worldSize.z }).map((_, index) => {
      const position = getClusterPositionForIndex(index);
      const cluster = addCluster(position);
      return cluster;
    });

    clusters.forEach((cluster) => {
      if (cluster.index < worldSize.x * worldSize.z) {
        Array.from({ length: clusterSize.x * clusterSize.z }).map((block, index) => {
          return addBlockForIndex(
            index,
            Array.from({ length: 12 }).map(() => true),
            cluster.index
          );
        });
      }
    });

    clusters.forEach((cluster) => {
      cluster.blocks.forEach((block) => {
        if (block.isActive) {
          calculateBlockNeighbours(block.index, block.parentCluster);
        }
      });
    });

    window.addEventListener('keyup', () => {
      setRenderTicker((state) => {
        console.log(state++);
        return state++;
      });
    });
  }, []);

  return (
    <main className="w-full h-screen bg-zinc-900">
      <Canvas ref={canvas}>
        <axesHelper />
        <OrbitControls />
        <pointLight position={[-1, 2, -2]} />
        {clusters.map(({ position, blocks, index }) => (
          <Cluster key={'cluster-' + index + '-' + renderTicker} position={position} blocks={blocks} index={index} />
        ))}
        <InterfaceManager />
      </Canvas>
    </main>
  );
};

export default App;
