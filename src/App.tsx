import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import Grid from './components/Grid';
import InterfaceManager from './components/InterfaceManager';
import { initCanvasGestures } from './utilities/interfaceUtilities';

const App = () => {
  const canvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    console.log('render App');
    if (canvas.current) {
      initCanvasGestures(canvas.current);
    }
  }, []);

  return (
    <main className="w-full h-screen bg-zinc-900">
      <Canvas ref={canvas}>
        <axesHelper />
        <OrbitControls />
        <pointLight position={[-1, 2, -2]} />
        <Grid />
        {/* <Scene /> */}
        <InterfaceManager />
        {/* <Block position={new Vector3()} isDebugging={true} /> */}
      </Canvas>
    </main>
  );
};

export default App;
