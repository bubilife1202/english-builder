import { useGameStore } from '../store/useGameStore';
import type { Word } from '../types';

export const GameUI = () => {
  const inventory = useGameStore((state) => state.inventory);
  const sentenceSlots = useGameStore((state) => state.sentenceSlots);
  const health = useGameStore((state) => state.health);
  const maxHealth = useGameStore((state) => state.maxHealth);
  const addWordToSentence = useGameStore((state) => state.addWordToSentence);
  const executeSentence = useGameStore((state) => state.executeSentence);
  const clearSentence = useGameStore((state) => state.clearSentence);

  const handleWordClick = (word: Word, slotIndex: 0 | 1 | 2) => {
    addWordToSentence(slotIndex, word);
  };

  const getSlotLabel = (index: number): string => {
    if (index === 0) return 'Subject';
    if (index === 1) return 'Verb';
    return 'Object';
  };

  const getSlotColor = (index: number): string => {
    if (index === 0) return '#FF6B6B'; // Red for nouns
    if (index === 1) return '#4ECDC4'; // Blue for verbs
    return '#FFD93D'; // Yellow for objects
  };

  return (
    <>
      {/* Health Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 15px',
          borderRadius: '8px',
          color: 'white',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ marginBottom: '5px', fontSize: '12px' }}>Health</div>
        <div
          style={{
            width: '200px',
            height: '20px',
            background: '#333',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(health / maxHealth) * 100}%`,
              height: '100%',
              background: health > 50 ? '#4CAF50' : health > 25 ? '#FFA726' : '#F44336',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{ fontSize: '12px', marginTop: '5px' }}>
          {health} / {maxHealth}
        </div>
      </div>

      {/* Sentence Slots */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        {sentenceSlots.map((word, index) => (
          <div
            key={index}
            style={{
              width: '120px',
              height: '80px',
              background: 'rgba(0, 0, 0, 0.8)',
              border: `3px solid ${getSlotColor(index)}`,
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '10px', marginBottom: '5px', opacity: 0.7 }}>
              {getSlotLabel(index)}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {word ? word.text : '?'}
            </div>
            {word && (
              <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.7 }}>
                ({word.meaning})
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Execute Button */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        <button
          onClick={executeSentence}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Speak Sentence
        </button>
        <button
          onClick={clearSentence}
          style={{
            padding: '10px 20px',
            background: '#F44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
        >
          Clear
        </button>
      </div>

      {/* Inventory */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white',
          fontFamily: 'monospace',
          maxWidth: '250px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
          Inventory
        </div>
        {inventory.length === 0 ? (
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            Break blocks to collect words!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {inventory.map((word) => (
              <div
                key={word.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{word.text}</strong>
                  <span>x{word.count}</span>
                </div>
                <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '3px' }}>
                  {word.type} - {word.meaning}
                </div>
                <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                  <button
                    onClick={() => handleWordClick(word, 0)}
                    style={{
                      flex: 1,
                      padding: '3px',
                      fontSize: '9px',
                      background: '#FF6B6B',
                      border: 'none',
                      borderRadius: '3px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    S
                  </button>
                  <button
                    onClick={() => handleWordClick(word, 1)}
                    style={{
                      flex: 1,
                      padding: '3px',
                      fontSize: '9px',
                      background: '#4ECDC4',
                      border: 'none',
                      borderRadius: '3px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    V
                  </button>
                  <button
                    onClick={() => handleWordClick(word, 2)}
                    style={{
                      flex: 1,
                      padding: '3px',
                      fontSize: '9px',
                      background: '#FFD93D',
                      border: 'none',
                      borderRadius: '3px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    O
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
