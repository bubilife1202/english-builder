import Phaser from 'phaser';

export class MobileControls {
  private scene: Phaser.Scene;
  private joystick: Phaser.GameObjects.Container | null = null;
  private jumpButton: Phaser.GameObjects.Container | null = null;
  private joystickBase!: Phaser.GameObjects.Arc;
  private joystickThumb!: Phaser.GameObjects.Arc;
  private jumpBtn!: Phaser.GameObjects.Arc;

  public direction = { x: 0, y: 0 };
  public isJumpPressed = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    // Check if mobile device
    const isMobile = this.scene.sys.game.device.os.android ||
                     this.scene.sys.game.device.os.iOS ||
                     this.scene.sys.game.device.os.iPad ||
                     this.scene.sys.game.device.os.iPhone;

    if (!isMobile && window.innerWidth > 768) {
      return; // Don't show on desktop
    }

    this.createJoystick();
    this.createJumpButton();
  }

  private createJoystick() {
    const x = 100;
    const y = this.scene.scale.height - 100;

    this.joystick = this.scene.add.container(x, y);
    this.joystick.setScrollFactor(0);
    this.joystick.setDepth(1000);

    // Base
    this.joystickBase = this.scene.add.circle(0, 0, 50, 0x333333, 0.5);
    this.joystickBase.setStrokeStyle(3, 0xFFFFFF, 0.8);

    // Thumb
    this.joystickThumb = this.scene.add.circle(0, 0, 25, 0x4ECDC4, 0.8);
    this.joystickThumb.setStrokeStyle(2, 0xFFFFFF);

    this.joystick.add([this.joystickBase, this.joystickThumb]);

    // Make interactive
    this.joystickBase.setInteractive({ draggable: false });
    this.joystickThumb.setInteractive({ draggable: true });

    let isDragging = false;

    this.joystickBase.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      isDragging = true;
      this.updateJoystick(pointer);
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (isDragging) {
        this.updateJoystick(pointer);
      }
    });

    this.scene.input.on('pointerup', () => {
      isDragging = false;
      this.joystickThumb.setPosition(0, 0);
      this.direction = { x: 0, y: 0 };
    });
  }

  private updateJoystick(pointer: Phaser.Input.Pointer) {
    if (!this.joystick) return;

    const joystickWorldPos = this.joystick.getWorldTransformMatrix();
    const joystickX = joystickWorldPos.tx;
    const joystickY = joystickWorldPos.ty;

    const dx = pointer.x - joystickX;
    const dy = pointer.y - joystickY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 50;

    if (distance < maxDistance) {
      this.joystickThumb.setPosition(dx, dy);
      this.direction.x = dx / maxDistance;
      this.direction.y = dy / maxDistance;
    } else {
      const angle = Math.atan2(dy, dx);
      const thumbX = Math.cos(angle) * maxDistance;
      const thumbY = Math.sin(angle) * maxDistance;
      this.joystickThumb.setPosition(thumbX, thumbY);
      this.direction.x = Math.cos(angle);
      this.direction.y = Math.sin(angle);
    }
  }

  private createJumpButton() {
    const x = this.scene.scale.width - 100;
    const y = this.scene.scale.height - 100;

    this.jumpButton = this.scene.add.container(x, y);
    this.jumpButton.setScrollFactor(0);
    this.jumpButton.setDepth(1000);

    // Button background
    this.jumpBtn = this.scene.add.circle(0, 0, 45, 0xFF6B6B, 0.7);
    this.jumpBtn.setStrokeStyle(3, 0xFFFFFF, 0.9);

    // Jump icon (arrow up)
    const arrow = this.scene.add.triangle(
      0, -5,
      0, -15,
      -10, 5,
      10, 5,
      0xFFFFFF
    );

    this.jumpButton.add([this.jumpBtn, arrow]);

    // Make interactive
    this.jumpBtn.setInteractive();

    this.jumpBtn.on('pointerdown', () => {
      this.isJumpPressed = true;
      this.jumpBtn.setFillStyle(0xFF4444, 1);
    });

    this.jumpBtn.on('pointerup', () => {
      this.isJumpPressed = false;
      this.jumpBtn.setFillStyle(0xFF6B6B, 0.7);
    });

    this.jumpBtn.on('pointerout', () => {
      this.isJumpPressed = false;
      this.jumpBtn.setFillStyle(0xFF6B6B, 0.7);
    });
  }

  getMovement() {
    return {
      left: this.direction.x < -0.3,
      right: this.direction.x > 0.3,
      jump: this.isJumpPressed,
    };
  }

  destroy() {
    if (this.joystick) {
      this.joystick.destroy();
    }
    if (this.jumpButton) {
      this.jumpButton.destroy();
    }
  }
}
