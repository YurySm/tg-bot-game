const {gameOptions, againOptions} = require('./options')

const TelegramBot = require('node-telegram-bot-api');

const token = '7235460779:AAGHlbfzKHCd4ElYo4otyXbm3ZrUKQsYBJs'

const bot = new TelegramBot(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал число от 0 до 9`);
    const randomNum = Math.floor(Math.random() * Math.floor(10));

    chats[chatId] = randomNum

    await bot.sendMessage(chatId, `отгадай его`, gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Игра "Угадай число"'}
    ])

    bot.on('message', async (msg) => {
        // const chatId = msg.chat.id;
        //
        // bot.sendMessage(chatId, 'Received your message');
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/3.webp')
            return bot.sendMessage(chatId, `Добро пожаловать, ${msg.from.username}!`);
        }

        if(text === '/info') {
            return bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name}`);
        }

        if(text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, `Я тебя не понимаю...`);
    });

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === '/again') {
            return startGame(chatId)
        }

        if(+data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю!!! Ты угадал, ${data}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Не отгадал, я загадал ${chats[chatId]}`, againOptions);
        }
    })
}

start()