import Phaser from 'phaser';
import { MobileControls } from '../systems/MobileControls';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private wordBoxes!: Phaser.Physics.Arcade.Group;
  private monsters!: Phaser.Physics.Arcade.Group;
  private collectedWords: string[] = [];
  private mobileControls!: MobileControls;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Create simple colored rectangles as placeholders
    // In production, replace with actual sprite sheets
    this.createPlaceholderAssets();
  }

  create() {
    // Create platforms (ground and floating platforms)
    this.createPlatforms();

    // Create player
    this.createPlayer();

    // Create word boxes to collect
    this.createWordBoxes();

    // Create monsters
    this.createMonsters();

    // Setup controls
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Setup mobile controls
    this.mobileControls = new MobileControls(this);
    this.mobileControls.create();

    // Setup collisions
    this.setupCollisions();

    // Add UI text
    this.createUI();

    // Camera follows player
    this.cameras.main.setBounds(0, 0, 1600, 600);
    this.cameras.main.startFollow(this.player);
  }

  private createPlaceholderAssets() {
    // Player sprite (blue rectangle)
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x4169E1, 1);
    playerGraphics.fillRect(0, 0, 32, 48);
    playerGraphics.generateTexture('player', 32, 48);
    playerGraphics.destroy();

    // Platform sprite (brown rectangle)
    const platformGraphics = this.add.graphics();
    platformGraphics.fillStyle(0x8B4513, 1);
    platformGraphics.fillRect(0, 0, 64, 32);
    platformGraphics.generateTexture('platform', 64, 32);
    platformGraphics.destroy();

    // Word box sprite (yellow box with outline)
    const wordBoxGraphics = this.add.graphics();
    wordBoxGraphics.fillStyle(0xFFD700, 1);
    wordBoxGraphics.fillRect(0, 0, 32, 32);
    wordBoxGraphics.lineStyle(2, 0x000000);
    wordBoxGraphics.strokeRect(0, 0, 32, 32);
    wordBoxGraphics.generateTexture('wordbox', 32, 32);
    wordBoxGraphics.destroy();

    // Monster sprite (red circle - slime style)
    const monsterGraphics = this.add.graphics();
    monsterGraphics.fillStyle(0xFF6B6B, 1);
    monsterGraphics.fillCircle(24, 24, 24);
    monsterGraphics.fillStyle(0x000000, 1);
    monsterGraphics.fillCircle(16, 18, 4); // Left eye
    monsterGraphics.fillCircle(32, 18, 4); // Right eye
    monsterGraphics.generateTexture('monster', 48, 48);
    monsterGraphics.destroy();
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    // Ground - extended for scrolling
    for (let i = 0; i < 25; i++) {
      this.platforms.create(i * 64, 568, 'platform').setScale(1).refreshBody();
    }

    // Floating platforms (MapleStory style)
    this.platforms.create(400, 450, 'platform').setScale(2, 1).refreshBody();
    this.platforms.create(700, 350, 'platform').setScale(2, 1).refreshBody();
    this.platforms.create(300, 250, 'platform').setScale(2, 1).refreshBody();
    this.platforms.create(900, 300, 'platform').setScale(2, 1).refreshBody();
    this.platforms.create(1200, 400, 'platform').setScale(2, 1).refreshBody();
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(false);
    this.physics.world.setBounds(0, 0, 1600, 600);
  }

  private createWordBoxes() {
    this.wordBoxes = this.physics.add.group();

    const words = ['Apple', 'Eat', 'I', 'Cat', 'Run', 'Big', 'Dog', 'Like'];
    const positions = [
      { x: 200, y: 400 },
      { x: 450, y: 400 },
      { x: 750, y: 300 },
      { x: 350, y: 200 },
      { x: 950, y: 250 },
      { x: 1250, y: 350 },
      { x: 600, y: 500 },
      { x: 1100, y: 500 },
    ];

    positions.forEach((pos, index) => {
      const box = this.wordBoxes.create(pos.x, pos.y, 'wordbox');
      box.setData('word', words[index]);

      // Add floating text label
      const text = this.add.text(pos.x, pos.y - 25, words[index], {
        fontSize: '14px',
        color: '#000',
        backgroundColor: '#fff',
        padding: { x: 4, y: 2 },
      });
      text.setOrigin(0.5);
      box.setData('label', text);
    });
  }

  private createMonsters() {
    this.monsters = this.physics.add.group();

    const monsterPositions = [
      { x: 500, y: 400 },
      { x: 800, y: 300 },
      { x: 1100, y: 350 },
    ];

    monsterPositions.forEach((pos) => {
      const monster = this.monsters.create(pos.x, pos.y, 'monster');
      monster.setVelocityX(Phaser.Math.Between(-50, 50));
      monster.setBounce(1);
      monster.setCollideWorldBounds(true);
      monster.setData('sentence', 'I eats apple'); // Wrong sentence
    });
  }

  private setupCollisions() {
    // Player collides with platforms
    this.physics.add.collider(this.player, this.platforms);

    // Monsters collide with platforms
    this.physics.add.collider(this.monsters, this.platforms);

    // Player collects word boxes
    this.physics.add.overlap(
      this.player,
      this.wordBoxes,
      this.collectWord,
      undefined,
      this
    );

    // Player touches monster -> start battle
    this.physics.add.overlap(
      this.player,
      this.monsters,
      this.startBattle,
      undefined,
      this
    );
  }

  private createUI() {
    // Fixed UI that doesn't scroll with camera
    const uiText = this.add.text(16, 16, 'Collected Words: 0\nLevel: 1 | HP: 100', {
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
    });
    uiText.setScrollFactor(0);
    uiText.setDepth(100);
    uiText.setData('type', 'ui');
  }

  private collectWord(
    _player: any,
    wordBox: any
  ) {
    const box = wordBox as Phaser.Physics.Arcade.Sprite;
    const word = box.getData('word');
    const label = box.getData('label');

    this.collectedWords.push(word);

    // Update UI
    const uiText = this.children.list.find(
      (child) => child.getData('type') === 'ui'
    ) as Phaser.GameObjects.Text;
    if (uiText) {
      uiText.setText(
        `Collected Words: ${this.collectedWords.length}\nLevel: 1 | HP: 100\nWords: ${this.collectedWords.join(', ')}`
      );
    }

    // Destroy word box and label
    if (label) {
      label.destroy();
    }
    box.destroy();

    // Play sound effect (placeholder)
    console.log('Collected word:', word);
  }

  private startBattle(
    _player: any,
    monster: any
  ) {
    const monsterSprite = monster as Phaser.Physics.Arcade.Sprite;
    const wrongSentence = monsterSprite.getData('sentence');

    console.log('Battle started! Wrong sentence:', wrongSentence);

    // Pass data to battle scene
    this.scene.pause('MainScene');
    this.scene.launch('BattleScene', {
      monster: {
        wrongSentence,
        hp: 100,
        sprite: monsterSprite,
      },
      playerWords: this.collectedWords,
      onBattleEnd: (won: boolean) => {
        this.scene.stop('BattleScene');
        this.scene.resume('MainScene');
        if (won) {
          monsterSprite.destroy();
        }
      },
    });
  }

  update() {
    // Get mobile controls
    const mobileInput = this.mobileControls?.getMovement() || { left: false, right: false, jump: false };

    // Player movement (keyboard or mobile)
    if (this.cursors.left.isDown || mobileInput.left) {
      this.player.setVelocityX(-200);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown || mobileInput.right) {
      this.player.setVelocityX(200);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // Jump (MapleStory style - can only jump when on ground)
    if ((this.cursors.up.isDown || mobileInput.jump) && this.player.body!.touching.down) {
      this.player.setVelocityY(-400);
    }

    // Update monster patrol
    this.monsters.children.entries.forEach((monster) => {
      const monsterSprite = monster as Phaser.Physics.Arcade.Sprite;
      if (monsterSprite.body!.velocity.x === 0) {
        monsterSprite.setVelocityX(Phaser.Math.Between(-50, 50));
      }
    });

    // Update word box labels to follow their boxes
    this.wordBoxes.children.entries.forEach((box) => {
      const boxSprite = box as Phaser.Physics.Arcade.Sprite;
      const label = boxSprite.getData('label');
      if (label) {
        label.setPosition(boxSprite.x, boxSprite.y - 25);
      }
    });
  }
}
