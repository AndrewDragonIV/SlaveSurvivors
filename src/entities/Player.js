
export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        if (!scene) {
            console.error('Scene is required for Player');
            return;
        }

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        // Настройки физики
        this.body.setCollideWorldBounds(true);
        
        // Начальные параметры
        this.speed = 300;
        this.health = 100;
    }

    update() {
        // Логика обновления игрока будет добавлена позже
    }

    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}
