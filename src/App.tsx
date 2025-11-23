import { useEffect, useRef } from 'react';
import { vocabGame } from './game/config';
import './App.css';

function App() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      if (gameContainerRef.current && !gameInstanceRef.current) {
        gameInstanceRef.current = vocabGame.init('game-container');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (gameInstanceRef.current) {
        vocabGame.destroy();
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a1a2e',
      overflow: 'hidden',
    }}>
      <div style={{
        marginBottom: '15px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h1 style={{
          margin: '0 0 5px 0',
          fontSize: '28px',
          color: '#FFD700',
        }}>
          🎮 Vocab Quest
        </h1>
      </div>

      <div
        id="game-container"
        ref={gameContainerRef}
        style={{
          width: '800px',
          height: '600px',
          border: '3px solid #FFD700',
          borderRadius: '8px',
          backgroundColor: '#000',
        }}
      />

      <div style={{
        marginTop: '15px',
        padding: '10px 20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '14px',
      }}>
        Arrow Keys: Move | Up: Jump | Collect words & battle monsters!
      </div>
    </div>
  );
}

export default App;
