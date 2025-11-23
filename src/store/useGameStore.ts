import { create } from 'zustand';
import type { Block, BlockPosition, BlockType, Word } from '../types';

interface InventoryWord extends Word {
  count: number;
}

interface GameState {
  blocks: Block[];
  inventory: InventoryWord[];
  sentenceSlots: [Word | null, Word | null, Word | null];
  health: number;
  maxHealth: number;
  addBlock: (position: BlockPosition, type: BlockType, word?: Word) => void;
  removeBlock: (position: BlockPosition) => void;
  addWordToInventory: (word: Word) => void;
  addWordToSentence: (slotIndex: 0 | 1 | 2, word: Word) => void;
  clearSentence: () => void;
  validateSentence: () => boolean;
  executeSentence: () => void;
  saveWorld: () => void;
  loadWorld: () => void;
}

const STORAGE_KEY = 'vocab-voxel-world';

// Sample words for blocks
const sampleWords: Word[] = [
  { id: 'word_001', text: 'I', type: 'noun', meaning: '나', drop_biome: 'forest', difficulty: 1 },
  { id: 'word_002', text: 'Apple', type: 'noun', meaning: '사과', drop_biome: 'forest', difficulty: 1 },
  { id: 'word_006', text: 'Eat', type: 'verb', meaning: '먹다', drop_biome: 'village', difficulty: 1 },
  { id: 'word_010', text: 'Like', type: 'verb', meaning: '좋아하다', drop_biome: 'village', difficulty: 1 },
  { id: 'word_012', text: 'Big', type: 'adjective', meaning: '큰', drop_biome: 'forest', difficulty: 1 },
];

// Generate initial terrain with word blocks
const generateTerrain = (): Block[] => {
  const blocks: Block[] = [];
  const size = 20; // 20x20 ground
  const height = 1;

  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      for (let y = 0; y < height; y++) {
        blocks.push({
          x,
          y,
          z,
          type: y === height - 1 ? 'grass' : 'dirt',
        });
      }
    }
  }

  // Add some word blocks scattered around
  const wordBlockPositions = [
    { x: 5, y: 1, z: 5 },
    { x: -5, y: 1, z: 5 },
    { x: 5, y: 1, z: -5 },
    { x: -5, y: 1, z: -5 },
    { x: 0, y: 1, z: 8 },
    { x: 8, y: 1, z: 0 },
    { x: -8, y: 1, z: 0 },
    { x: 0, y: 1, z: -8 },
  ];

  wordBlockPositions.forEach((pos, i) => {
    const word = sampleWords[i % sampleWords.length];
    const blockType = word.type === 'noun' ? 'wood' : word.type === 'verb' ? 'dirt' : 'grass';
    blocks.push({
      ...pos,
      type: blockType,
      word: word.text,
      partOfSpeech: word.type,
    });
  });

  return blocks;
};

export const useGameStore = create<GameState>((set, get) => ({
  blocks: generateTerrain(),
  inventory: [],
  sentenceSlots: [null, null, null],
  health: 100,
  maxHealth: 100,

  addBlock: (position, type, word) => {
    const { blocks } = get();
    const exists = blocks.some(
      (b) => b.x === position.x && b.y === position.y && b.z === position.z
    );

    if (!exists) {
      const newBlock: Block = { ...position, type };
      if (word) {
        newBlock.word = word.text;
        newBlock.partOfSpeech = word.type;
      }
      set({ blocks: [...blocks, newBlock] });
      get().saveWorld();
    }
  },

  removeBlock: (position) => {
    const { blocks } = get();
    const block = blocks.find(
      (b) => b.x === position.x && b.y === position.y && b.z === position.z
    );

    // If block has a word, add it to inventory
    if (block?.word && block?.partOfSpeech) {
      const wordData: Word = {
        id: `word_${block.word}`,
        text: block.word,
        type: block.partOfSpeech,
        meaning: '',
        drop_biome: 'forest',
        difficulty: 1,
      };
      get().addWordToInventory(wordData);
    }

    set((state) => ({
      blocks: state.blocks.filter(
        (b) => !(b.x === position.x && b.y === position.y && b.z === position.z)
      ),
    }));
    get().saveWorld();
  },

  addWordToInventory: (word) => {
    set((state) => {
      const existing = state.inventory.find((w) => w.id === word.id);
      if (existing) {
        return {
          inventory: state.inventory.map((w) =>
            w.id === word.id ? { ...w, count: w.count + 1 } : w
          ),
        };
      } else {
        return {
          inventory: [...state.inventory, { ...word, count: 1 }],
        };
      }
    });
  },

  addWordToSentence: (slotIndex, word) => {
    set((state) => {
      const newSlots: [Word | null, Word | null, Word | null] = [...state.sentenceSlots];
      newSlots[slotIndex] = word;
      return { sentenceSlots: newSlots };
    });
  },

  clearSentence: () => {
    set({ sentenceSlots: [null, null, null] });
  },

  validateSentence: () => {
    const { sentenceSlots } = get();
    const [subject, verb, object] = sentenceSlots;

    // Basic validation: need all three slots filled
    if (!subject || !verb || !object) return false;

    // Check grammar: Subject (noun), Verb (verb), Object (noun/adjective)
    if (subject.type !== 'noun') return false;
    if (verb.type !== 'verb') return false;
    if (object.type !== 'noun' && object.type !== 'adjective') return false;

    return true;
  },

  executeSentence: () => {
    const { sentenceSlots, health, maxHealth, validateSentence, clearSentence } = get();

    if (validateSentence()) {
      // Correct sentence! Reward player
      const sentence = sentenceSlots.map((w) => w?.text).join(' ');

      // Speak the sentence using Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }

      // Heal player
      set({ health: Math.min(health + 20, maxHealth) });

      // Show success message (in real implementation, use a toast/notification)
      console.log('✅ Correct sentence:', sentence);

      // Clear sentence slots
      clearSentence();
    } else {
      console.log('❌ Incorrect sentence structure');
    }
  },

  saveWorld: () => {
    const { blocks } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
  },

  loadWorld: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const blocks = JSON.parse(saved);
        set({ blocks });
      } catch (e) {
        console.error('Failed to load world', e);
      }
    }
  },
}));
