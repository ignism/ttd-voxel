import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Block from './components/Block';
import Debug from './components/Debug';
import Grid from './components/Grid';
import InterfaceManager from './components/InterfaceManager';
import Scene from './components/Scene';
import WithNeighbours from './components/WithNeighbours';

const App = () => {
  return (
    <main className="w-full h-screen bg-zinc-900">
      <Canvas>
        <axesHelper />
        <OrbitControls />
        {/* <Grid /> */}
        {/* <Scene /> */}
        <InterfaceManager />
        <Block position={new Vector3()} isDebugging={true} />
      </Canvas>
    </main>
  );
};

export default App;
