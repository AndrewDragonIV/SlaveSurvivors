import { config } from './config.js';
import MainScene from'./scenes/MainScene.js';

// Устанавливаем сцену в конфиг
config.scene = MainScene;

// Создаем игру
const game = new Phaser.Game(config);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});