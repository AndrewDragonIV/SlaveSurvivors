import { Logger } from '../utils/Logger.js';
import Player from '../entities/Player.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.targetPoint = null;
        this.tg = window.Telegram.WebApp;
        Logger.log('MainScene', 'Constructor initialized');
    }

    init() {
        try {
            if (window.Telegram && window.Telegram.WebApp) {
                this.tg = window.Telegram.WebApp;
                this.tg.expand();
                Logger.log('MainScene', 'Telegram WebApp initialized');
            }

            if (this.tg.initDataUnsafe?.start_param === 'game') {
                Logger.log('MainScene', 'Started via /game command');
            }
        } catch (error) {
            Logger.log('MainScene', Initialization error: ${error.message}, 'error');
        }
    }

    preload() {
        Logger.log('MainScene', 'Starting assets preload');
        
        this.load.on('progress', (value) => {
            Logger.log('MainScene', Loading progress: ${Math.round(value * 100)}%);
        });

        this.load.on('complete', () => {
            Logger.log('MainScene', 'Assets loading completed');
        });

        this.load.on('loaderror', (file) => {
            Logger.log('MainScene', Failed to load asset: ${file.src}, 'error');
        });
    
        try {
            this.load.image('player', 'assets/slavik.png');
            this.load.image('particle', 'assets/particle.png');
            this.load.image('background', 'assets/background.png');
            Logger.log('MainScene', 'Started loading game assets');
        } catch (error) {
            Logger.log('MainScene', Error loading assets: ${error.message}, 'error');
        }
    }

    create() {
        try {
            Logger.log('MainScene', 'Starting scene creation');

            // Создаем фон
            this.background = this.add.tileSprite(0, 0, 600, 600, 'background');
            this.background.setOrigin(0, 0);
            this.background.setDepth(-1);
            Logger.log('MainScene', 'Background created');

            // Создаем границы
            this.createBorders();
            
            // Устанавливаем границы мира
            this.physics.world.setBounds(0, 0, 600, 600);
            Logger.log('MainScene', 'World bounds set');
            
            // Создаем игрока
            this.player = new Player(
                this,
                this.cameras.main.centerX,
                this.cameras.main.centerY
            );
            Logger.log('MainScene', Player created at (${this.cameras.main.centerX}, ${this.cameras.main.centerY}));

            // Настраиваем камеру
            this.cameras.main.startFollow(this.player);
            Logger.log('MainScene', 'Camera following player');

            // Настраиваем обработчики ввода
            this.setupInputHandlers();
            Logger.log('MainScene', 'Input handlers setup completed');

        } catch (error) {
            Logger.log('MainScene', Error in create method: ${error.message}, 'error');
        }
    }

    setupInputHandlers() {
        try {
            this.input.on('pointerdown', (pointer) => {
                this.targetPoint = {
                    x: pointer.x + this.cameras.main.scrollX,
                    y: pointer.y + this.cameras.main.scrollY
                };
                Logger.log('MainScene', Pointer down at (${this.targetPoint.x}, ${this.targetPoint.y});
            });

            this.input.on('pointermove', (pointer) => {
                if (pointer.isDown) {
                    this.targetPoint = {
                        x: pointer.x + this.cameras.main.scrollX,
                        y: pointer.y + this.cameras.main.scrollY
                    };
                    Logger.log('MainScene', `Player moving to (${this.targetPoint.x}, ${this.targetPoint.y})`);
                }
            });
            
            this.input.on('pointerup', () => {
                this.targetPoint = null;
                this.player.setVelocity(0, 0);
                Logger.log('MainScene', 'Player movement stopped');
            });

            Logger.log('MainScene', 'Input handlers setup completed');
        } catch (error) {
            Logger.log('MainScene', Error setting up input handlers: ${error.message}, 'error');
        }
    }

    createBorders() {
        try {
            // Здесь ваш код создания границ
            Logger.log('MainScene', 'Borders created successfully');
        } catch (error) {
            Logger.log('MainScene', Error creating borders: ${error.message}, 'error');
        }
    }

    moveToPoint(point) {
        try {
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

            Logger.log('MainScene', Moving player to (${Math.round(point.x)}, ${Math.round(point.y)}));
        } catch (error) {
            Logger.log('MainScene', Error moving to point: ${error.message}, 'error');
        }
    }

    update() {
        try {
            if (this.player) {
                this.player.update();
                
                if (this.targetPoint) {
                    this.moveToPoint(this.targetPoint);
                }
            }
        } catch (error) {
            Logger.log('MainScene', Error in update loop: ${error.message}, 'error');
        }
    }
}

export default MainScene;

