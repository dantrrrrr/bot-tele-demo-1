const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you received from BotFather
const token = process.env.TOKEN;
const url = process.env.URL;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const app=express();
app.use(bodyParser.json());

bot.setWebHook(`${url}/api/bot`);

app.post('/api/bot',(req,res)=>{
  bot.processUpdate(req.body);
  res.sendStatus(200);

})

// Matches any message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const receivedText = msg.text;

  // Echo back the received message
  bot.sendMessage(chatId, receivedText);
});

console.log('Bot is running...');
module.exports=app;