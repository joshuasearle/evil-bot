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
  console.log(textArray);
  const filterAllowed = textArray.filter((c) =>
    allowedChars.some((a) => a === c)
  );
  return filterAllowed.join('');
};

client.on('message', async (message) => {
  const strippedChars = removeInvisibleChars(message.content.toLowerCase());
  if (!startsWith(strippedChars, TRIGGER_MESSAGE)) return;
  try {
    const res = await axios.get(API_LINK);
    const insult = res.data;
    message.reply(insult);
  } catch (e) {
    message.reply('Network error');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
