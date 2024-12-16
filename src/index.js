// index.js
import MainScene from './scenes/MainScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container', // Изменено с 'game' на 'game-container'
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: MainScene,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    plugins: {
        global: [{
            key: 'rexVirtualJoystick',
            plugin: window.rexvirtualjoystickplugin,
            start: true
        }]
    }
};

class Game extends Phaser.Game {
    constructor(config) {
        super(config);
        window.game = this;
        
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.expand();
            tg.enableClosingConfirmation();
            tg.ready();
        }
    }
}

// Создаем игру сразу
window.addEventListener('load', () => {
    new Game(config);
});

// Обработка изменения размера
window.addEventListener('resize', () => {
    if (window.game) {
        window.game.scale.resize(window.innerWidth, window.innerHeight);
    }
});

// Блокировка скролла
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });
