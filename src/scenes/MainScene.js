
import Player from '../entities/Player.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.targetPoint = null;
        this.tg = null;
    }

    init() {
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.tg.expand();
        }
    }

    preload() {
        this.load.image('player', 'assets/slavik.png');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.createBackground();
        this.createBorders();
        this.setupWorld();
        this.createPlayer();
        this.setupCamera();
        this.setupInputHandlers();
    }

    createBackground() {
        this.background = this.add.tileSprite(0, 0, 600, 600, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(-1);
    }

    setupWorld() {
        this.physics.world.setBounds(0, 0, 600, 600);
    }

    createPlayer() {
        this.player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );
    }

    setupCamera() {
        this.cameras.main.startFollow(this.player);
    }

    setupInputHandlers() {
        this.input.on('pointerdown', this.handlePointerDown.bind(this));
        this.input.on('pointermove', this.handlePointerMove.bind(this));
        this.input.on('pointerup', this.handlePointerUp.bind(this));
    }

    handlePointerDown(pointer) {
        this.updateTargetPoint(pointer);
    }

    handlePointerMove(pointer) {
        if (pointer.isDown) {
            this.updateTargetPoint(pointer);
        }
    }

    handlePointerUp() {
        this.targetPoint = null;
        if (this.player) {
            this.player.setVelocity(0, 0);
        }
    }

    updateTargetPoint(pointer) {
        this.targetPoint = {
            x: pointer.x + this.cameras.main.scrollX,
            y: pointer.y + this.cameras.main.scrollY
        };
    }

    createBorders() {
        // Реализация создания границ
    }

    moveToPoint(point) {
        if (!this.player) return;

        const angle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            point.x,
            point.y
        );

        const velocity = 200;
        this.player.setVelocity(
            Math.cos(angle) * velocity,
            Math.sin(angle) * velocity
        );
    }

    update() {
        if (this.player) {
            this.player.update();

            if (this.targetPoint) {
                this.moveToPoint(this.targetPoint);
            }
        }
    }
}

export default MainScene;
