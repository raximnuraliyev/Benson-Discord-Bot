require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const axios = require('axios');

// Create a new client instance with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
  console.log(`Benson is online! Logged in as ${readyClient.user.tag}`);
});

// Welcome message when a new member joins
client.on(Events.GuildMemberAdd, async member => {
  try {
    // Find the welcome channel
    const welcomeChannel = member.guild.channels.cache.find(
      channel => channel.name === 'welcome' && channel.isTextBased()
    );
    // Find the roles channel (dynamic, looks for a channel with 'role' in the name)
    const rolesChannel = member.guild.channels.cache.find(
      channel => channel.name.includes('role') && channel.isTextBased()
    );

    let welcomeMessage = `Welcome to Boone cord, ${member}! 🎉`;
    if (rolesChannel) {
      welcomeMessage += `\nPlease grab some roles in ${rolesChannel}`;
    }

    if (welcomeChannel) {
      await welcomeChannel.send(welcomeMessage);
      console.log(`Welcome message sent for ${member.user.tag}`);
    } else {
      console.log('Welcome channel not found');
    }
  } catch (error) {
    console.error('Error sending welcome message:', error);
  }
});

// Farewell message when a member leaves
client.on(Events.GuildMemberRemove, async member => {
  try {
    // Find the goodbye channel
    const goodbyeChannel = member.guild.channels.cache.find(
      channel => channel.name === 'goodbye' && channel.isTextBased()
    );

    if (goodbyeChannel) {
      const farewellMessage = `Bye-bye, ${member.user.username}! 👋`;
      await goodbyeChannel.send(farewellMessage);
      console.log(`Farewell message sent for ${member.user.tag}`);
    } else {
      console.log('Goodbye channel not found');
    }
  } catch (error) {
    console.error('Error sending farewell message:', error);
  }
});

// Utility function to normalize message content for matching
function normalizeMessage(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z]/g, '') // remove non-letters
    .replace(/(y{2,}|h{2,}|i{2,}|e{2,}|o{2,}|a{2,}|u{2,}|s{2,}|t{2,}|k{2,}|n{2,}|g{2,}|d{2,}|m{2,}|l{2,}|c{2,}|r{2,}|w{2,}|b{2,}|f{2,}|p{2,}|v{2,}|z{2,})/g, match => match[0]); // collapse repeated letters
}

// Map of normalized triggers to reply messages
const baseReplies = [
  { triggers: ['hi', 'hello', 'hey', 'yo', 'yoo', 'yooo', 'yoooo'], reply: 'Hi there! 👋' },
  { triggers: ['howareyou', 'howru', 'hru', 'howryou', 'howareu'], reply: "Always good! How about you?" },
  { triggers: ['hbu', 'howaboutyou'], reply: "I'm good! How about you?" },
  { triggers: ['goodmorning', 'gm', 'morning'], reply: 'Good morning! ☀️ Hope you have a great day!' },
  { triggers: ['goodnight', 'gn', 'night'], reply: 'Good night! 🌙 Sweet dreams!' },
  { triggers: ['thanks', 'thankyou', 'ty', 'tysm', 'tyy', 'tyyy', 'thanku', 'thank'], reply: "You're welcome! 😊" },
  { triggers: ['bye', 'cya', 'goodbye', 'seeu', 'seeyou', 'seeusoon', 'seeyousoon', 'laters', 'later', 'farewell'], reply: 'Bye! See you soon! 👋' },
  { triggers: ['brb'], reply: 'Hurry back! 😊' },
  { triggers: ['wb'], reply: 'Welcome back! 🎉' },
  { triggers: ['np', 'yw'], reply: 'No problem! 👍' },
  { triggers: ['sup', 'whatsup', 'wassup'], reply: 'Not much, you?' },
  { triggers: ['greetings'], reply: 'Greetings! 👋' },
  { triggers: ['evening', 'goodevening'], reply: 'Good evening! 🌆' },
  { triggers: ['afternoon', 'goodafternoon'], reply: 'Good afternoon! ☀️' },
  { triggers: ['goodday'], reply: 'Good day! ☀️' },
  { triggers: ['takecare'], reply: 'Take care! 😊' },
  { triggers: ['cheers'], reply: 'Cheers! 🥂' },
  { triggers: ['appreciateit', 'appreciateyou', 'appreciated'], reply: "Glad to help! 😊" },
  { triggers: ['gracias'], reply: "De nada! 😊" },
  { triggers: ['arigato'], reply: "どういたしまして! 😊" },
  { triggers: ['danke'], reply: "Bitte schön! 😊" },
  { triggers: ['merci'], reply: "De rien! 😊" },
  { triggers: ['spasibo'], reply: "Пожалуйста! 😊" },
  { triggers: ['obrigado'], reply: "De nada! 😊" },
  { triggers: ['please', 'pls', 'plz'], reply: "Of course! 😊" },
  { triggers: ['no'], reply: "Okay! 👍" },
  { triggers: ['yes'], reply: "Great! 👍" },
  { triggers: ['maybe'], reply: "Let me know! 😊" },
  { triggers: ['ok', 'okay'], reply: "Okay! 👍" },
  { triggers: ['roger', 'rogerthat', 'rogerroger'], reply: "Roger that! 👍" },
  { triggers: ['copy', 'copied'], reply: "Copy that! 👍" }
];

const intlGreetings = [
  ['hola', '¡Hola! 👋'],
  ['bonjour', 'Bonjour! 🇫🇷'],
  ['salut', 'Salut! 👋'],
  ['ciao', 'Ciao! 👋'],
  ['namaste', 'Namaste! 🙏'],
  ['privet', 'Privet! 🇷🇺'],
  ['ola', 'Olá! 👋'],
  ['konichiwa', 'Konnichiwa! 🇯🇵'],
  ['annyeong', 'Annyeong! 🇰🇷'],
  ['nihao', 'Nǐ hǎo! 🇨🇳']
];

const replyMap = {};
for (const { triggers, reply } of baseReplies) {
  for (const t of triggers) {
    replyMap[t] = reply;
  }
}
for (const [greet, reply] of intlGreetings) {
  replyMap[greet] = reply;
}

// Function to get AI response from OpenRouter (free tier)
async function getAIResponse(userMessage) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are Benson, a friendly and helpful Discord bot.' },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data && response.data.choices && response.data.choices[0].message && response.data.choices[0].message.content) {
      return response.data.choices[0].message.content.trim();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting AI response from OpenRouter:', error);
    return null;
  }
}

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  try {
    const normalized = normalizeMessage(message.content);
    if (replyMap[normalized]) {
      await message.reply(replyMap[normalized]);
      console.log(`📝 Custom reply to ${message.author.tag}: "${message.content}" -> "${replyMap[normalized]}"`);
    } else {
      await message.channel.sendTyping();
      const aiResponse = await getAIResponse(message.content);
      if (aiResponse) {
        await message.reply(aiResponse);
        console.log(`🤖 AI reply to ${message.author.tag}: "${message.content}" -> "${aiResponse}"`);
      } else {
        await message.reply("Sorry, I'm having trouble thinking right now!");
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

// Error handling
client.on(Events.Error, error => {
  console.error('Error processing message:', error);
});

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down Benson gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down Benson gracefully...');
  client.destroy();
  process.exit(0);
});

// Login to Discord with your bot's token
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('No bot token provided! Please set the BOT_TOKEN in your .env file.');
  process.exit(1);
}

client.login(token).catch(error => {
  console.error('Failed to login:', error);
  process.exit(1);
});