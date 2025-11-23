import { useEffect, useRef } from 'react';
import { vocabGame } from './game/config';
import './App.css';

function App() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Initialize Phaser game
    if (gameContainerRef.current && !gameInstanceRef.current) {
      gameInstanceRef.current = vocabGame.init('game-container');
    }

    // Cleanup on unmount
    return () => {
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
    }}>
      <div style={{
        marginBottom: '20px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <h1 style={{
          margin: '10px 0',
          fontSize: '36px',
          color: '#FFD700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
          🎮 Vocab Quest: English Adventure
        </h1>
        <p style={{ margin: '5px 0', fontSize: '16px', color: '#4ECDC4' }}>
          MapleStory Style English Learning Game
        </p>
      </div>

      <div
        id="game-container"
        ref={gameContainerRef}
        style={{
          border: '4px solid #FFD700',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      />

      <div style={{
        marginTop: '20px',
        padding: '15px 30px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '10px',
        color: '#fff',
        textAlign: 'center',
        maxWidth: '800px',
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px', color: '#FFD700' }}>
          📋 How to Play
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '14px' }}>
          <div>⬅️➡️ Arrow Keys: Move</div>
          <div>⬆️ Up Arrow: Jump</div>
          <div>📦 Collect word boxes</div>
          <div>👹 Touch monsters to battle</div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#4ECDC4' }}>
          Make correct sentences to defeat monsters and level up!
        </div>
      </div>
    </div>
  );
}

export default App;
