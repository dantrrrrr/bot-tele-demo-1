const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you received from BotFather
const token = process.env.TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches any message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const receivedText = msg.text;

  // Echo back the received message
  bot.sendMessage(chatId, receivedText);
});

console.log('Bot is running...');
