import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Debug from './Debug';
import Grid from './Grid';

const App = () => {
  return (
    <main className="bg-zinc-900 w-full h-screen">
      <Canvas>
        <axesHelper />
        <OrbitControls />
        <Grid />
      </Canvas>
    </main>
  );
};

export default App;
