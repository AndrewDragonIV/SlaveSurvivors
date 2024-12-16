class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        if (!scene) {
            console.error('Scene is required for Player');
            return;
        }

        this.scene = scene;
        this.active = true;
        this.initialize();
    }

    initialize() {
        // Базовая инициализация
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Настройка физики
        this.setScale(0.5)
            .setCollideWorldBounds(true)
            .setBounce(0.1)
            .setDepth(1)
            .setDrag(0.95);

        // Инициализация компонентов
        this.initStats();
        this.createHealthBar();
        this.createParticles();
        this.setupControls();
    }

    initStats() {
        this.stats = {
            maxHealth: 100,
            currentHealth: 100,
            moveSpeed: 200,
            damage: 10,
            experience: 0,
            level: 1,
            experienceToNextLevel: 100
        };
    }

    createHealthBar() {
        const barConfig = {
            width: 50,
            height: 6,
            y: -40
        };

        this.healthBar = {
            background: this.scene.add.rectangle(
                this.x, 
                this.y + barConfig.y, 
                barConfig.width, 
                barConfig.height, 
                0x000000
            ),
            bar: this.scene.add.rectangle(
                this.x, 
                this.y + barConfig.y, 
                barConfig.width, 
                barConfig.height, 
                0xff0000
            )
        };

        [this.healthBar.background, this.healthBar.bar].forEach(bar => {
            bar.setDepth(9999);
            bar.setScrollFactor(1);
        });
    }

    createParticles() {
        if (!this.scene.textures.exists('particle')) {
            console.warn('Particle texture not found');
            return;
        }

        this.moveEmitter = this.scene.add.particles('particle').createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: -20, max: 20 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.1, end: 0 },
            blendMode: 'ADD',
            lifespan: 100,
            quantity: 1,
            on: false
        });
    }

    setupControls() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    handleMovement() {
        if (!this.active || !this.body) return;

        const velocity = { x: 0, y: 0 };
        
        if (this.cursors.left.isDown) velocity.x = -this.stats.moveSpeed;
        else if (this.cursors.right.isDown) velocity.x = this.stats.moveSpeed;
        
        if (this.cursors.up.isDown) velocity.y = -this.stats.moveSpeed;
        else if (this.cursors.down.isDown) velocity.y = this.stats.moveSpeed;

        // Нормализация диагонального движения
        if (velocity.x !== 0 && velocity.y !== 0) {
            const norm = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            velocity.x = (velocity.x / norm) * this.stats.moveSpeed;
            velocity.y = (velocity.y / norm) * this.stats.moveSpeed;
        }

        this.setVelocity(velocity.x, velocity.y);
        
        if (this.moveEmitter) {
            this.moveEmitter.on = velocity.x !== 0 || velocity.y !== 0;
        }
    }

    updateHealthBar() {
        if (!this.healthBar) return;

        const healthRatio = this.stats.currentHealth / this.stats.maxHealth;
        const barWidth = 50;
        const barY = this.y - 40;

        this.healthBar.background.setPosition(this.x, barY);
        this.healthBar.bar
            .setPosition(this.x - (barWidth * (1 - healthRatio)) / 2, barY)
            .setWidth(barWidth * healthRatio);
    }

    update() {if (!this.active) return;

        this.handleMovement();
        this.updateHealthBar();
        
        if (this.moveEmitter) {
            this.moveEmitter.setPosition(this.x, this.y);
        }
    }

    // ... остальные методы остаются без изменений ...

    destroy() {
        if (this.moveEmitter) {
            this.moveEmitter.destroy();
        }
        if (this.healthBar) {
            this.healthBar.background.destroy();
            this.healthBar.bar.destroy();
        }
        super.destroy();
    }
}

export default Player;