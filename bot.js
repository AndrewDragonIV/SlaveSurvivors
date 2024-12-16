const TelegramBot = require('node-telegram-bot-api');
const token = '8082097658:AAES_GleVt3jlZirou-y8yGdC0jN23BZCZA'; // Получите токен у BotFather
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/game/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Запустить игру:', {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🎮 Играть',
                    web_app: {url: 'https://andrewdragoniv.github.io/SlaveSurvivors'}
                }
            ]]
        }
    });
});

console.log('Bot is running...');