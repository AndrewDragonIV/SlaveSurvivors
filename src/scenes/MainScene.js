
import Player from '../entities/Player.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.targetPoint = null;
        this.tg = window.Telegram.WebApp;
    }

    init() {
        // Проверяем, открыто ли в Telegram
        if (window.Telegram && window.Telegram.WebApp) {
        this.tg = window.Telegram.WebApp;
        // Расширяем на весь экран
        this.tg.expand();
    }
        // Проверяем, запущено ли через команду
        if (this.tg.initDataUnsafe?.start_param === 'game') {
            console.log('Game started via /game command');
        }
    }

    preload() {
        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.src);
        });
    
        this.load.image('player', 'assets/slavik.png');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        // Сразу создаем все игровые элементы без ожидания
        this.background = this.add.tileSprite(0, 0, 600, 600, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(-1);

        this.createBorders();
        
        this.physics.world.setBounds(0, 0, 600, 600);
        
        this.player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );

        this.cameras.main.startFollow(this.player);

        // Настраиваем обработчики ввода
        this.setupInputHandlers();
    }

    setupInputHandlers() {
        this.input.on('pointerdown', (pointer) => {
            this.targetPoint = {
                x: pointer.x + this.cameras.main.scrollX,
                y: pointer.y + this.cameras.main.scrollY
            };
        });

        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.targetPoint = {
                    x: pointer.x + this.cameras.main.scrollX,
                    y: pointer.y + this.cameras.main.scrollY
                };
            }
        });
        
        this.input.on('pointerup', () => {
            this.targetPoint = null;
            this.player.setVelocity(0, 0);
        });
    }

    createBorders() {
        // Ваш существующий код createBorders без изменений
    }

    moveToPoint(point) {
        // Ваш существующий код moveToPoint без изменений
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
