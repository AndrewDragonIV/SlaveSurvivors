
const config = {
    type: Phaser.AUTO,
    width: 1280,  // фиксированная ширина
    height: 720,  // фиксированная высота
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: MainScene,
    scale: {
        mode: Phaser.Scale.FIT,  // автоматическое масштабирование
        autoCenter: Phaser.Scale.CENTER_BOTH  // центрирование игры
    }
};
