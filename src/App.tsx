import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Player } from './components/Player';
import { Ground } from './components/Ground';
import { Crosshair } from './components/Crosshair';
import { BlockInteraction } from './components/BlockInteraction';
import { GameUI } from './components/GameUI';
import { WordBlockLabels } from './components/WordBlockLabels';
import { useGameStore } from './store/useGameStore';

function App() {
  const loadWorld = useGameStore((state) => state.loadWorld);

  useEffect(() => {
    loadWorld();
  }, [loadWorld]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Crosshair />
      <GameUI />
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        style={{ background: '#87CEEB' }}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Physics gravity={[0, -20, 0]}>
          <Player />
          <Ground />
          <BlockInteraction />
        </Physics>
        <WordBlockLabels />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '10px 20px',
          borderRadius: '8px',
          fontFamily: 'monospace',
        }}
      >
        <div>WASD: Move | Space: Jump | Left Click: Remove Block | Right Click: Add Block</div>
      </div>
    </div>
  );
}

export default App;
