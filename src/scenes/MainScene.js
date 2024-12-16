
export default class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.player = null;
        this.background = null;
    }

    preload() {
        this.load.image('player', 'assets/slavik.png');
        this.load.image('particle', 'assets/particle.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        // Добавляем бэкграунд
        this.background = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'background');
        this.background.setOrigin(0, 0);

        // Создаем игрока в центре экрана
        this.player = this.physics.add.sprite(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'player'
        );
        
        // Настраиваем физику игрока
        this.player.setCollideWorldBounds(true);
        
        // Создаем курсор для управления
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Обработка движения игрока
        const speed = 300;
        
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        } else {
            this.player.setVelocityY(0);
        }
    }
}
