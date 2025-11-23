import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { BattleScene } from './scenes/BattleScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: false,
    },
  },
  scene: [MainScene, BattleScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export class VocabQuestGame {
  private game: Phaser.Game | null = null;

  init(parent: string) {
    if (this.game) {
      this.game.destroy(true);
    }

    this.game = new Phaser.Game({
      ...gameConfig,
      parent,
    });

    return this.game;
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  getGame() {
    return this.game;
  }
}

export const vocabGame = new VocabQuestGame();
