const axios = require('axios');
const discord = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new discord.Client();
const TRIGGER_WORD = 'oi mate';
const TAMPER_MESSAGE = `\`\`\`css
####################################################
# TAMPER ATTEMPT DETECTED. PLEASE STOP IMMEDIATELY #
####################################################
\`\`\``;

const API_LINK =
  'https://evilinsult.com/generate_insult.php?lang=en&amp;type=json';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const sendTamper = (message, tamperMessage) => {
  message.channel.send(tamperMessage);
  message.channel.send(tamperMessage);
  message.channel.send(tamperMessage);
  message.channel.send('Discord bot will self destruct in');
  const n = 5;
  for (let i = n; i >= 2; i--) {
    const millseconds = (n - i) * 5000;
    setTimeout(() => {
      message.channel.send(String(i));
    }, millseconds);
  }
  const secondLastMillseconds = (n - 1) * 5000;
  setTimeout(() => {
    message.channel.send('Network error');
  }, secondLastMillseconds);

  const lastMillseconds = n * 5000;
  setTimeout(() => {
    message.reply('Nice space btw');
  }, lastMillseconds);
};

const subStringInString = (subString, string) => {
  if (subString.length > string.length) return false;

  let currentSubStringCharIndex = 0;
  let currentStringIndex = 0;

  // While still chars in string, and full substring hasn't matched
  while (
    currentStringIndex < string.length &&
    currentSubStringCharIndex !== subString.length
  ) {
    if (string[currentStringIndex] === subString[currentSubStringCharIndex]) {
      currentSubStringCharIndex += 1;
    }
    currentStringIndex += 1;
  }

  const match = currentSubStringCharIndex === subString.length;
  return [match, currentStringIndex];
};

const checkMessage = (message, trigger) => {
  const messageLower = message.toLowerCase();
  const triggerLower = trigger.toLowerCase();

  // If all chars in message match, set match to true
  const match = triggerLower.split('').reduce((matchSoFar, triggerChar, i) => {
    return matchSoFar && triggerChar === messageLower[i];
  });

  // Extract list of words that are contained in the trigger word
  const triggerWords = triggerLower.split(' ');

  // If the message contains all of the words, and not a match, set tampered to true
  const tampered =
    !match &&
    triggerWords.reduce(
      (acc, triggerWord) => {
        const { tamperedSoFar, prevEnd } = acc;
        const [match, endIndex] = subStringInString(triggerWord, messageLower);
        return {
          tamperedSoFar:
            tamperedSoFar &&
            match &&
            prevEnd < endIndex &&
            endIndex < prevEnd + trigger.length,
          prevEnd: endIndex,
        };
      },
      { tamperedSoFar: true, prevEnd: 0 }
    ).tamperedSoFar;

  if (messageLower.length > 10 * trigger.length) return [match, false];
  return [match, tampered];
};

client.on('message', async (message) => {
  try {
    const [match, tampered] = checkMessage(message.content, TRIGGER_WORD);
    // Guards
    if (!match && !tampered) return;
    if (!match && tampered) return sendTamper(message, TAMPER_MESSAGE);

    const res = await axios.get(API_LINK);
    const insult = res.data;
    message.reply(insult);
  } catch (e) {
    console.log(e);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
