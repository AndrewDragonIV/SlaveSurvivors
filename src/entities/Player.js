class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Базовые настройки игрока
        this.setScale(0.5);
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setDepth(1);

        // Настройки HP бара
        this.hpBackground = scene.add.rectangle(0, 0, 50, 6, 0x000000);
        this.hpBar = scene.add.rectangle(0, 0, 50, 6, 0xff0000);
        this.hpBackground.setDepth(9999);
        this.hpBar.setDepth(9999);

        // Характеристики игрока
        this.stats = {
            maxHealth: 100,
            currentHealth: 100,
            moveSpeed: 200,
            damage: 10,
            experience: 0,
            level: 1,
            experienceToNextLevel: 100
        };

        // Частицы движения
        this.moveEmitter = scene.add.particles('particle').createEmitter({
            x: x,
            y: y,
            speed: { min: -20, max: 20 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.1, end: 0 },
            blendMode: 'ADD',
            lifespan: 100,
            quantity: 1,
            on: false
        });

        // Управление
        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    handleMovement() {
        // Горизонтальное движение
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.stats.moveSpeed);
            this.moveEmitter.on = true;
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.stats.moveSpeed);
            this.moveEmitter.on = true;
        } else {
            this.setVelocityX(0);
            this.moveEmitter.on = false;
        }

        // Вертикальное движение
        if (this.cursors.up.isDown) {
            this.setVelocityY(-this.stats.moveSpeed);
            this.moveEmitter.on = true;
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(this.stats.moveSpeed);
            this.moveEmitter.on = true;
        } else {
            this.setVelocityY(0);
        }

        // Нормализация диагонального движения
        if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
            this.body.velocity.normalize().scale(this.stats.moveSpeed);
        }
    }

    takeDamage(amount) {
        this.stats.currentHealth = Math.max(0, this.stats.currentHealth - amount);
        
        if (this.stats.currentHealth <= 0) {
            this.die();
        }
    }

    gainExperience(amount) {
        this.stats.experience += amount;
        if (this.stats.experience >= this.stats.experienceToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.stats.level++;
        this.stats.experience -= this.stats.experienceToNextLevel;
        this.stats.experienceToNextLevel *= 1.2;
        
        // Увеличение характеристик
        this.stats.maxHealth *= 1.1;
        this.stats.currentHealth = this.stats.maxHealth;
        this.stats.damage *= 1.1;
        this.stats.moveSpeed *= 1.05;

        // Эффект левел-апа
        const levelUpEffect = this.scene.add.particles('particle');
        levelUpEffect.createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: -200, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 20
        });
    }

    die() {
        // Эффект смерти
        const deathEmitter = this.scene.add.particles('particle').createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            quantity: 30
        });

        // Отключаем все
        this.moveEmitter.on = false;
        this.hpBackground.destroy();
        this.hpBar.destroy();
        this.destroy();
        
        // Событие смерти
        this.scene.events.emit('playerDeath');
    }

    update() {
        if (!this.active) return;

        this.handleMovement();
        
        // Обновляем HP бар
        this.hpBackground.x = this.x;
        this.hpBackground.y = this.y - 40;
        this.hpBar.x = this.x;
        this.hpBar.y = this.y - 40;
        this.hpBar.width = 50 * (this.stats.currentHealth / this.stats.maxHealth);

        // Обновляем частицы
        this.moveEmitter.setPosition(this.x, this.y);
    }
}

export default Player;