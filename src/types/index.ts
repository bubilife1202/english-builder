export type BlockType = 'grass' | 'dirt' | 'wood' | 'stone';

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';

export interface BlockPosition {
  x: number;
  y: number;
  z: number;
}

export interface Block extends BlockPosition {
  type: BlockType;
  word?: string;
  partOfSpeech?: PartOfSpeech;
}

export interface Word {
  id: string;
  text: string;
  type: PartOfSpeech;
  meaning: string;
  drop_biome: string;
  difficulty: number;
}

export interface PlayerState {
  health: number;
  maxHealth: number;
  position: [number, number, number];
}
