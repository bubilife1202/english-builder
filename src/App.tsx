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
      justifyContent: 'flex-start',
      backgroundColor: '#1a1a2e',
      overflow: 'hidden',
      padding: '10px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        marginBottom: '10px',
        textAlign: 'center',
        color: '#fff',
        width: '100%',
      }}>
        <h1 style={{
          margin: '5px 0',
          fontSize: 'clamp(20px, 5vw, 36px)',
          color: '#FFD700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}>
          🎮 Vocab Quest
        </h1>
        <p style={{
          margin: '2px 0',
          fontSize: 'clamp(12px, 3vw, 16px)',
          color: '#4ECDC4',
          display: window.innerWidth < 600 ? 'none' : 'block',
        }}>
          MapleStory Style English Learning Game
        </p>
      </div>

      <div
        id="game-container"
        ref={gameContainerRef}
        style={{
          border: '3px solid #FFD700',
          borderRadius: '8px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
          maxWidth: '100%',
          maxHeight: 'calc(100vh - 150px)',
          flex: '1',
        }}
      />

      <div style={{
        marginTop: '10px',
        padding: '10px 15px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: '8px',
        color: '#fff',
        textAlign: 'center',
        width: '100%',
        maxWidth: '800px',
        fontSize: 'clamp(10px, 2.5vw, 14px)',
      }}>
        <div style={{
          fontSize: 'clamp(12px, 3vw, 18px)',
          marginBottom: '5px',
          color: '#FFD700',
        }}>
          📋 Controls
        </div>
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <div>⬅️➡️ Move</div>
          <div>⬆️ Jump</div>
          <div>📦 Collect</div>
          <div>👹 Battle</div>
        </div>
      </div>
    </div>
  );
}

export default App;
