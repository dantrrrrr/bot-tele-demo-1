const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with the token you received from BotFather
const token = process.env.TOKEN;
const url = process.env.URL;
const channelIds = process.env.CHANNEL_IDS.split(','); // List of channel usernames with '@'


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const app=express();
app.use(bodyParser.json());

bot.setWebHook(`${url}/api/bot`);

app.post('/api/bot',(req,res)=>{
  bot.processUpdate(req.body);
  res.sendStatus(200);

})

// Handle various message types
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  console.log(`Received a message from chat id ${chatId}`);

  let messageContent = [];

  if (msg.text) {
    messageContent.push({ type: 'text', content: msg.text });
  }

  if (msg.photo) {
    // Collect file IDs of all available resolutions
    const photo = msg.photo[msg.photo.length - 1];
    messageContent.push({ type: 'photo', fileId: photo.file_id });
  }

  if (msg.video) {
    messageContent.push({ type: 'video', fileId: msg.video.file_id });
  }

  if (msg.document) {
    messageContent.push({ type: 'document', fileId: msg.document.file_id });
  }

  if (msg.audio) {
    messageContent.push({ type: 'audio', fileId: msg.audio.file_id });
  }

  if (msg.sticker) {
    messageContent.push({ type: 'sticker', fileId: msg.sticker.file_id });
  }

  if (messageContent.length === 0) {
    console.log('Received unsupported message type');
    await bot.sendMessage(chatId, "Sorry, I can't handle this type of message yet.");
    return;
  }

  try {
    for (const channelId of channelIds) {
      const sentMediaIds = new Set(); // Track sent media to avoid duplicates

      for (const item of messageContent) {
        if (item.type === 'text') {
          await bot.sendMessage(channelId, item.content);
          console.log(`Sent text message to channel ${channelId}`);
        } else if (item.type === 'photo') {
          // Handle photo separately to avoid duplication
      
            if (!sentMediaIds.has(item.fileId)) {
              await bot.sendPhoto(channelId, item.fileId);
              console.log(`Sent photo to channel ${channelId}`);
              sentMediaIds.add(item.fileId);
            }
          
        } else if (item.type === 'video') {
          // Send video
          if (!sentMediaIds.has(item.fileId)) {
            await bot.sendVideo(channelId, item.fileId);
            console.log(`Sent video to channel ${channelId}`);
            sentMediaIds.add(item.fileId);
          }
        } else if (item.type === 'document') {
          // Send document
          if (!sentMediaIds.has(item.fileId)) {
            await bot.sendDocument(channelId, item.fileId);
            console.log(`Sent document to channel ${channelId}`);
            sentMediaIds.add(item.fileId);
          }
        } else if (item.type === 'audio') {
          // Send audio
          if (!sentMediaIds.has(item.fileId)) {
            await bot.sendAudio(channelId, item.fileId);
            console.log(`Sent audio to channel ${channelId}`);
            sentMediaIds.add(item.fileId);
          }
        } else if (item.type === 'sticker') {
          // Send sticker
          if (!sentMediaIds.has(item.fileId)) {
            await bot.sendSticker(channelId, item.fileId);
            console.log(`Sent sticker to channel ${channelId}`);
            sentMediaIds.add(item.fileId);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error sending messages to channels:', error);
  }
});


console.log('Bot is running...');
module.exports = app;