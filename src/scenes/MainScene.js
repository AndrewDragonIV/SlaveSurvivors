
import Player from '../entities/Player.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.targetPoint = null; // Добавляем целевую точку
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
        this.background = this.add.tileSprite(0, 0, 600, 600, 'background');
        this.background.setOrigin(0, 0);
        this.background.setDepth(-1);

        // Добавляем границы
        this.createBorders();
        
        this.physics.world.setBounds(0, 0, 600, 600);
        
        this.player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );

        this.cameras.main.startFollow(this.player);

        this.input.on('pointerdown', (pointer) => {
            // Сохраняем целевую точку
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
        // Создаем графический объект для отрисовки границ
        const graphics = this.add.graphics();
        
        // Настраиваем стиль линии
        graphics.lineStyle(4, 0xFF0000, 1); // толщина 4, красный цвет, полная непрозрачность
        
        // Рисуем прямоугольник по границам мира
        graphics.strokeRect(0, 0, 600, 600);
        
        // Можно добавить дополнительные визуальные элементы
        // Например, угловые маркеры
        const markerSize = 20;
        
        // Верхний левый угол
        graphics.lineStyle(4, 0xFFFF00, 1); // Желтый цвет для маркеров
        graphics.beginPath();
        graphics.moveTo(0, markerSize);
        graphics.lineTo(0, 0);
        graphics.lineTo(markerSize, 0);
        graphics.strokePath();
        
        // Верхний правый угол
        graphics.beginPath();
        graphics.moveTo(600 - markerSize, 0);
        graphics.lineTo(600, 0);
        graphics.lineTo(600, markerSize);
        graphics.strokePath();
        
        // Нижний правый угол
        graphics.beginPath();
        graphics.moveTo(600, 600 - markerSize);
        graphics.lineTo(600, 600);
        graphics.lineTo(600 - markerSize, 600);
        graphics.strokePath();
        
        // Нижний левый угол
        graphics.beginPath();
        graphics.moveTo(markerSize, 600);
        graphics.lineTo(0, 600);
        graphics.lineTo(0, 600 - markerSize);
        graphics.strokePath();
    }

    moveToPoint(point) {
        const dx = point.x - this.player.x;
        const dy = point.y - this.player.y;
        
        // Проверяем, достаточно ли близко к цели
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 5) { // если игрок почти достиг цели
            this.targetPoint = null;
            this.player.setVelocity(0, 0);
            return;
        }

        const angle = Math.atan2(dy, dx);
        this.player.setVelocity(
            Math.cos(angle) * this.player.stats.moveSpeed,
            Math.sin(angle) * this.player.stats.moveSpeed
        );
    }

    update() {
        if (this.player) {
            this.player.update();
            
            // Если есть целевая точка, двигаемся к ней
            if (this.targetPoint) {
                this.moveToPoint(this.targetPoint);
            }
        }
    }
}

export default MainScene;
