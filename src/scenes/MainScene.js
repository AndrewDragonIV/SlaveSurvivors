
// MainScene.js
import Player from '../entities/Player.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.targetPoint = null;
    }

    preload() {
        // Добавляем обработку ошибок загрузки
        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.key);
        });

        // Правильные пути к ассетам (проверьте пути!)
        this.load.image('player', './assets/slavik.png');
        this.load.image('particle', './assets/particle.png');
        this.load.image('background', './assets/background.png');
    }

    create() {
        // Создаем игровой мир большего размера
        const worldSize = 600;
        this.physics.world.setBounds(0, 0, worldSize, worldSize);

        // Создаем тайловый фон
        this.background = this.add.tileSprite(0, 0, worldSize, worldSize, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(-1);
        this.background.setScrollFactor(1);

        // Создаем игрока
        this.player = new Player(
            this,
            worldSize / 2,
            worldSize / 2
        );

        // Настраиваем камеру
        this.cameras.main.setBounds(0, 0, worldSize, worldSize);
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1);

        // Настраиваем ввод
        this.setupInputHandlers();
    }

    setupInputHandlers() {
        this.input.on('pointerdown', (pointer) => {
            this.updateTargetPoint(pointer);
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.updateTargetPoint(pointer);
            }
        });

        this.input.on('pointerup', () => {
            this.targetPoint = null;
            if (this.player && this.player.body) {
                this.player.setVelocity(0, 0);
            }
        });
    }

    updateTargetPoint(pointer) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.targetPoint = {
            x: worldPoint.x,
            y: worldPoint.y
        };
    }

    moveToPoint(point) {
        if (!this.player || !this.player.body) return;

        const angle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            point.x,
            point.y
        );

        const velocity = 200;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        this.player.setVelocity(vx, vy);
    }

    update() {
        if (this.player && this.targetPoint) {
            this.moveToPoint(this.targetPoint);
        }

        // Обновляем фон
        if (this.background && this.cameras.main) {
            this.background.setTilePosition(
                this.cameras.main.scrollX,
                this.cameras.main.scrollY
            );
        }
    }
}

export default MainScene;
