class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        this.initializePlayer(scene);
        this.createHealthBar();
        this.createParticles(x, y);
        this.setupControls();
    }

    initializePlayer(scene) {
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(0.5)
            .setCollideWorldBounds(true)
            .setBounce(0.1)
            .setDepth(1);

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
        const BAR_DEPTH = 9999;
        const BAR_WIDTH = 50;
        const BAR_HEIGHT = 6;

        this.hpBackground = this.scene.add.rectangle(0, 0, BAR_WIDTH, BAR_HEIGHT, 0x000000);
        this.hpBar = this.scene.add.rectangle(0, 0, BAR_WIDTH, BAR_HEIGHT, 0xff0000);
        
        [this.hpBackground, this.hpBar].forEach(bar => bar.setDepth(BAR_DEPTH));
    }

    createParticles(x, y) {
        this.moveEmitter = this.scene.add.particles('particle').createEmitter({
            x,
            y,
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
        const velocity = { x: 0, y: 0 };
        
        if (this.cursors.left.isDown) velocity.x = -this.stats.moveSpeed;
        else if (this.cursors.right.isDown) velocity.x = this.stats.moveSpeed;
        
        if (this.cursors.up.isDown) velocity.y = -this.stats.moveSpeed;
        else if (this.cursors.down.isDown) velocity.y = this.stats.moveSpeed;

        this.setVelocity(velocity.x, velocity.y);
        this.moveEmitter.on = velocity.x !== 0 || velocity.y !== 0;

        if (velocity.x !== 0 && velocity.y !== 0) {
            this.body.velocity.normalize().scale(this.stats.moveSpeed);
        }
    }

    takeDamage(amount) {
        this.stats.currentHealth = Math.max(0, this.stats.currentHealth - amount);
        if (this.stats.currentHealth <= 0) this.die();
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
        
        this.updateStatsOnLevelUp();
        this.createLevelUpEffect();
    }

    updateStatsOnLevelUp() {
        this.stats.maxHealth *= 1.1;
        this.stats.currentHealth = this.stats.maxHealth;
        this.stats.damage *= 1.1;
        this.stats.moveSpeed *= 1.05;
    }

    createLevelUpEffect() {
        this.scene.add.particles('particle').createEmitter({
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
        this.createDeathEffect();
        this.cleanup();
        this.scene.events.emit('playerDeath');
    }

    createDeathEffect() {
        this.scene.add.particles('particle').createEmitter({
            x: this.x,
            y: this.y,
            speed: { min: -100, max: 100 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD',
            lifespan: 800,
            quantity: 30});
        }
    
        cleanup() {
            this.moveEmitter.on = false;
            this.hpBackground.destroy();
            this.hpBar.destroy();
            this.destroy();
        }
    
        updateHealthBar() {
            const healthBarY = this.y - 40;
            const healthRatio = this.stats.currentHealth / this.stats.maxHealth;
    
            this.hpBackground.setPosition(this.x, healthBarY);
            this.hpBar.setPosition(this.x, healthBarY)
                .setWidth(50 * healthRatio);
        }
    
        update() {
            if (!this.active) return;
    
            this.handleMovement();
            this.updateHealthBar();
            this.moveEmitter.setPosition(this.x, this.y);
        }
    }
    
    export default Player;