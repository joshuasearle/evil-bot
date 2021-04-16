const axios = require('axios');
const discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new discord.Client();

const TRIGGER_MESSAGE = 'oi mate';
const API_LINK =
  'https://evilinsult.com/generate_insult.php?lang=en&amp;type=json';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.content != TRIGGER_MESSAGE) return;
  try {
    const res = await axios.get(API_LINK);
    const insult = res.data;
    message.reply(insult);
  } catch (e) {
    message.reply('Network error');
  }

  // axios
  //   .get(API_LINK)
  //   .then((res) => {
  //     const insult = res.data;
  //     message.reply(insult);
  //   })
  //   .catch((err) => {
  //     message.reply('Network error');
  //   });
});

client.login(process.env.DISCORD_BOT_TOKEN);
