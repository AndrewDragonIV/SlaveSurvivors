
export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.maxHealth = 100;
        this.currentHealth = 100;
    }
    
    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        // Создаем повторяющийся фон
        this.background = this.add.tileSprite(0, 0, 2560, 1440, 'background');
        this.background.setOrigin(0, 0); // Устанавливаем точку отсчета в левый верхний угол
        
        // Создаем игрока в центре экрана
        this.player = this.physics.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'player'
        );
        
        // Настраиваем камеру
        this.cameras.main.setBounds(0, 0, 2560, 1440); // Устанавливаем границы мира
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09); // Камера следует за игроком с небольшим сглаживанием
        
        // Ограничиваем движение игрока границами мира
        this.physics.world.setBounds(0, 0, 2560, 1440);
        this.player.setCollideWorldBounds(true);
        
        // Создаем курсоры для управления
        this.cursors = this.input.keyboard.createCursorKeys();

        // Создаем HP бар
        this.createHealthBar();

        // Настраиваем UI слой, чтобы он следовал за камерой
        this.healthBarGroup = this.add.group();
    }

    createHealthBar() {
        // Создаем контур HP бара (серый)
        this.healthBarBorder = this.add.rectangle(
            0, -40,
            104, 14,
            0x808080
        );
        
        // Создаем фон HP бара (черный)
        this.healthBarBackground = this.add.rectangle(
            0, -40,
            100, 10,
            0x000000
        );

        // Создаем заполнение HP бара (красный)
        this.healthBarFill = this.add.rectangle(
            -50, -40,
            100, 10,
            0xff0000
        );
        this.healthBarFill.setOrigin(0, 0.5);

        // Добавляем все элементы в группу
        this.healthBarGroup.add(this.healthBarBorder);
        this.healthBarGroup.add(this.healthBarBackground);
        this.healthBarGroup.add(this.healthBarFill);

        this.updateHealthBarPosition();
    }

    updateHealthBarPosition() {
        // Обновляем позицию всех элементов HP бара с учетом положения камеры
        this.healthBarBorder.setPosition(this.player.x, this.player.y - 40);
        this.healthBarBackground.setPosition(this.player.x, this.player.y - 40);
        
        const healthPercentage = this.currentHealth / this.maxHealth;
        this.healthBarFill.setPosition(this.player.x - 50, this.player.y - 40);
        this.healthBarFill.width = 100 * healthPercentage;
    }

    update() {
        const speed = 200;
        let velocityX = 0;
        let velocityY = 0;

        // Горизонтальное движение
        if (this.cursors.left.isDown) {
            velocityX = -speed;
        } else if (this.cursors.right.isDown) {
            velocityX = speed;
        }

        // Вертикальное движение
        if (this.cursors.up.isDown) {
            velocityY = -speed;
        } else if (this.cursors.down.isDown) {
            velocityY = speed;
        }

        // Нормализация диагонального движения
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= Math.SQRT1_2;
            velocityY *= Math.SQRT1_2;
        }

        // Применяем скорость к игроку
        this.player.setVelocity(velocityX, velocityY);

        // Обновляем позицию HP бара
        this.updateHealthBarPosition();
    }

    updateHealth(amount) {
        this.currentHealth = Phaser.Math.Clamp(this.currentHealth + amount, 0, this.maxHealth);
        this.updateHealthBarPosition();
    }
}
