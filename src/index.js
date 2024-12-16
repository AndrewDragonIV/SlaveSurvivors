// index.js
import MainScene from './scenes/MainScene.js';

// Получаем экземпляр Telegram WebApp
const tg = window.Telegram.WebApp;

// Настройка размеров под размер окна
const getGameDimensions = () => {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
};

// Конфигурация игры
const config = {
    type: Phaser.AUTO,
    ...getGameDimensions(),
    parent: 'game',
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
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    plugins: {
        global: [ {
            key: 'rexVirtualJoystick',
            plugin: window.rexvirtualjoystickplugin,
            start: true
        } ]
    }
};

// Класс игры с поддержкой Telegram
class Game extends Phaser.Game {
    constructor(config) {
        super(config);
        
        // Сохраняем ссылку на игру глобально для доступа из других частей приложения
        window.game = this;

        // Подписываемся на события Telegram
        tg.onEvent('viewportChanged', this.handleViewportChange.bind(this));
        
        // Инициализация завершена
        tg.ready();
    }

    handleViewportChange() {
        const { width, height } = getGameDimensions();
        this.scale.resize(width, height);
    }

    // Метод для отправки данных в Telegram при необходимости
    sendScore(score) {
        tg.sendData(JSON.stringify({ score: score }));
    }
}

// Создаем игру только если запущено в Telegram
if (tg.initDataUnsafe.user) {
    const game = new Game(config);
} else {
    console.warn('This game should be run in Telegram Mini Apps');
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (window.game) {
        const { width, height } = getGameDimensions();
        window.game.scale.resize(width, height);
    }
});

// Предотвращаем скролл на мобильных устройствах
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

