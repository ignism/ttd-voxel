import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Debug from './Debug';
import Grid from './Grid';

const App = () => {
  return (
    <main className="w-full h-screen bg-zinc-900">
      <Canvas>
        <axesHelper />
        <OrbitControls />
        <Grid />
      </Canvas>
    </main>
  );
};

export default App;
