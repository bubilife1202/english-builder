import Phaser from 'phaser';

interface BattleData {
  monster: {
    wrongSentence: string;
    hp: number;
    sprite: Phaser.Physics.Arcade.Sprite;
  };
  playerWords: string[];
  onBattleEnd: (won: boolean) => void;
}

export class BattleScene extends Phaser.Scene {
  private monster!: any;
  private playerWords: string[] = [];
  private onBattleEnd!: (won: boolean) => void;
  private sentenceSlots: (string | null)[] = [null, null, null];
  private monsterHp: number = 100;
  private playerHp: number = 100;
  private slotTexts: Phaser.GameObjects.Text[] = [];
  private wordButtons: Phaser.GameObjects.Container[] = [];

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: BattleData) {
    this.monster = data.monster;
    this.playerWords = data.playerWords;
    this.onBattleEnd = data.onBattleEnd;
    this.monsterHp = data.monster.hp;
    this.playerHp = 100;
    this.sentenceSlots = [null, null, null];
  }

  create() {
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x2C3E50);

    // Title
    this.add.text(400, 40, '⚔️ BATTLE! ⚔️', {
      fontSize: '32px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Monster display
    this.createMonsterDisplay();

    // Wrong sentence display
    this.add.text(400, 150, `Monster says: "${this.monster.wrongSentence}"`, {
      fontSize: '18px',
      color: '#FF6B6B',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
    }).setOrigin(0.5);

    this.add.text(400, 180, '❌ This sentence is WRONG!', {
      fontSize: '14px',
      color: '#fff',
    }).setOrigin(0.5);

    // Instructions
    this.add.text(400, 220, 'Make the CORRECT sentence to attack!', {
      fontSize: '16px',
      color: '#4ECDC4',
    }).setOrigin(0.5);

    // Sentence slots
    this.createSentenceSlots();

    // Word inventory
    this.createWordInventory();

    // Action buttons
    this.createActionButtons();

    // HP bars
    this.createHPBars();
  }

  private createMonsterDisplay() {
    // Monster image (recreate from texture)
    const monsterGraphics = this.add.graphics();
    monsterGraphics.fillStyle(0xFF6B6B, 1);
    monsterGraphics.fillCircle(400, 100, 30);
    monsterGraphics.fillStyle(0x000000, 1);
    monsterGraphics.fillCircle(390, 95, 5);
    monsterGraphics.fillCircle(410, 95, 5);
  }

  private createSentenceSlots() {
    const slotLabels = ['Subject', 'Verb', 'Object'];
    const slotColors = ['#FF6B6B', '#4ECDC4', '#FFD93D'];

    slotLabels.forEach((label, index) => {
      const x = 250 + index * 150;
      const y = 280;

      // Slot background
      const slotBg = this.add.rectangle(x, y, 130, 80, 0x34495E);
      slotBg.setStrokeStyle(3, parseInt(slotColors[index].replace('#', '0x')));

      // Slot label
      this.add.text(x, y - 50, label, {
        fontSize: '12px',
        color: slotColors[index],
      }).setOrigin(0.5);

      // Slot text
      const slotText = this.add.text(x, y, '?', {
        fontSize: '18px',
        color: '#fff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.slotTexts.push(slotText);

      // Click to clear slot
      slotBg.setInteractive();
      slotBg.on('pointerdown', () => {
        this.sentenceSlots[index] = null;
        this.updateSentenceSlots();
      });
    });
  }

  private createWordInventory() {
    this.add.text(400, 380, '📦 Your Words:', {
      fontSize: '16px',
      color: '#fff',
    }).setOrigin(0.5);

    if (this.playerWords.length === 0) {
      this.add.text(400, 420, 'No words collected yet!', {
        fontSize: '14px',
        color: '#999',
      }).setOrigin(0.5);
      return;
    }

    const startX = 400 - (this.playerWords.length * 45);
    this.playerWords.forEach((word, index) => {
      const x = startX + index * 90;
      const y = 430;

      const container = this.add.container(x, y);

      // Word button background
      const bg = this.add.rectangle(0, 0, 80, 40, 0x3498DB);
      bg.setStrokeStyle(2, 0x2C3E50);
      bg.setInteractive();

      // Word text
      const text = this.add.text(0, 0, word, {
        fontSize: '14px',
        color: '#fff',
      }).setOrigin(0.5);

      container.add([bg, text]);
      this.wordButtons.push(container);

      // Click to add word to first empty slot
      bg.on('pointerdown', () => {
        const emptySlotIndex = this.sentenceSlots.findIndex((slot) => slot === null);
        if (emptySlotIndex !== -1) {
          this.sentenceSlots[emptySlotIndex] = word;
          this.updateSentenceSlots();
        }
      });

      // Hover effect
      bg.on('pointerover', () => {
        bg.setFillStyle(0x2980B9);
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(0x3498DB);
      });
    });
  }

  private createActionButtons() {
    // Attack button
    this.createButton(300, 520, '⚔️ Attack!', 0x27AE60, () => {
      this.attackMonster();
    });

    // Speak button (TTS)
    this.createButton(400, 520, '🔊 Speak', 0x3498DB, () => {
      this.speakSentence();
    });

    // Clear button
    this.createButton(500, 520, '❌ Clear', 0xE74C3C, () => {
      this.clearSlots();
    });
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    color: number,
    callback: () => void
  ) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 120, 40, color);
    bg.setInteractive();
    bg.setStrokeStyle(2, 0x000000);

    const buttonText = this.add.text(0, 0, text, {
      fontSize: '14px',
      color: '#fff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add([bg, buttonText]);

    bg.on('pointerdown', callback);
    bg.on('pointerover', () => {
      bg.setFillStyle(color - 0x222222);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(color);
    });

    return container;
  }

  private createHPBars() {
    // Monster HP
    this.add.text(600, 100, 'Monster HP:', {
      fontSize: '14px',
      color: '#fff',
    });

    this.add.rectangle(680, 108, 100, 16, 0x2C3E50);
    const monsterHpBar = this.add.rectangle(630, 108, 100, 12, 0xFF6B6B);
    monsterHpBar.setData('type', 'monsterHp');

    // Player HP
    this.add.text(100, 100, 'Your HP:', {
      fontSize: '14px',
      color: '#fff',
    });

    this.add.rectangle(180, 108, 100, 16, 0x2C3E50);
    const playerHpBar = this.add.rectangle(130, 108, 100, 12, 0x27AE60);
    playerHpBar.setData('type', 'playerHp');
  }

  private updateSentenceSlots() {
    this.slotTexts.forEach((text, index) => {
      text.setText(this.sentenceSlots[index] || '?');
    });
  }

  private clearSlots() {
    this.sentenceSlots = [null, null, null];
    this.updateSentenceSlots();
  }

  private speakSentence() {
    const sentence = this.sentenceSlots.filter((s) => s !== null).join(' ');
    if (sentence) {
      // Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }
  }

  private attackMonster() {
    // Validate sentence
    const [subject, verb, object] = this.sentenceSlots;

    if (!subject || !verb || !object) {
      this.showMessage('❌ Fill all slots!', 0xE74C3C);
      return;
    }

    // Simple grammar check (basic SVO validation)
    const isValid = this.validateSentence(subject, verb, object);

    if (isValid) {
      // Correct! Deal damage
      const damage = 50;
      this.monsterHp -= damage;

      // Speak the sentence
      this.speakSentence();

      // Update monster HP bar
      const hpBar = this.children.list.find(
        (child) => child.getData('type') === 'monsterHp'
      ) as Phaser.GameObjects.Rectangle;
      if (hpBar) {
        hpBar.setScale(this.monsterHp / 100, 1);
      }

      this.showMessage(`✅ Correct! -${damage} HP`, 0x27AE60);

      // Check if monster defeated
      if (this.monsterHp <= 0) {
        this.time.delayedCall(1500, () => {
          this.showVictory();
        });
      }
    } else {
      // Wrong! Take damage
      this.playerHp -= 10;

      // Update player HP bar
      const hpBar = this.children.list.find(
        (child) => child.getData('type') === 'playerHp'
      ) as Phaser.GameObjects.Rectangle;
      if (hpBar) {
        hpBar.setScale(this.playerHp / 100, 1);
      }

      this.showMessage('❌ Wrong grammar! -10 HP', 0xE74C3C);

      // Check if player defeated
      if (this.playerHp <= 0) {
        this.time.delayedCall(1500, () => {
          this.showDefeat();
        });
      }
    }

    // Clear slots after attack
    this.time.delayedCall(1000, () => {
      this.clearSlots();
    });
  }

  private validateSentence(subject: string, verb: string, object: string): boolean {
    // Basic validation: check if words are in correct categories
    const nouns = ['I', 'Apple', 'Cat', 'Dog', 'House'];
    const verbs = ['eat', 'Eat', 'run', 'Run', 'like', 'Like', 'jump', 'Jump'];
    const adjectives = ['big', 'Big', 'red', 'Red', 'fast', 'Fast', 'small', 'Small'];

    // Subject should be a noun
    const isSubjectValid = nouns.includes(subject);

    // Verb should be a verb
    const isVerbValid = verbs.includes(verb);

    // Object can be noun or adjective
    const isObjectValid = nouns.includes(object) || adjectives.includes(object);

    return isSubjectValid && isVerbValid && isObjectValid;
  }

  private showMessage(text: string, color: number) {
    const message = this.add.text(400, 350, text, {
      fontSize: '20px',
      color: '#fff',
      backgroundColor: `#${color.toString(16)}`,
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5);

    this.tweens.add({
      targets: message,
      alpha: 0,
      y: 320,
      duration: 1500,
      onComplete: () => {
        message.destroy();
      },
    });
  }

  private showVictory() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    this.add.text(400, 250, '🎉 VICTORY! 🎉', {
      fontSize: '48px',
      color: '#FFD700',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 320, 'Monster Defeated!\n+100 EXP', {
      fontSize: '24px',
      color: '#fff',
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.onBattleEnd(true);
    });
  }

  private showDefeat() {
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    this.add.text(400, 250, '💔 DEFEATED 💔', {
      fontSize: '48px',
      color: '#E74C3C',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(400, 320, 'Try collecting more words!', {
      fontSize: '24px',
      color: '#fff',
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      this.onBattleEnd(false);
    });
  }
}
