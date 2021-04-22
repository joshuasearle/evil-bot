const axios = require('axios');
const discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new discord.Client();

const TRIGGER_MESSAGE = 'oi mate';
const API_LINK =
  'https://evilinsult.com/generate_insult.php?lang=en&amp;type=json';

const allowedChars = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  ' ',
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const startsWith = (text, prefix) => {
  return prefix.split('').reduce((sameSoFar, char, i) => {
    return sameSoFar && char.toLowerCase() === text[i].toLowerCase();
  });
};

const removeInvisibleChars = (text) => {
  const textArray = text.split('');
  const filterAllowed = textArray.filter((c) =>
    allowedChars.some((a) => a === c)
  );
  const notAllowed = textArray.length === filterAllowed.length;
  return [filterAllowed.join(''), notAllowed];
};

client.on('message', async (message) => {
  try {
    const [strippedChars, tampered] = removeInvisibleChars(
      message.content.toLowerCase()
    );
    if (!startsWith(strippedChars, TRIGGER_MESSAGE)) {
      if (tampered) {
        message.reply('Nice space');
      }
      return;
    }
    const res = await axios.get(API_LINK);
    const insult = res.data;
    message.reply(insult);
  } catch (e) {
    message.reply('Network error');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
