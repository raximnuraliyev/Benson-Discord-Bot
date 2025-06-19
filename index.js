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

    let welcomeMessage = `welcome to Boone cord! Please grab some roles in `;
    if (rolesChannel) {
      welcomeMessage += `${rolesChannel} !`;
    } else {
      welcomeMessage += '`#roles`!';
    }

    // Attach a GIF (replace with your own or use a static link)
    const gifUrl = 'https://media.discordapp.net/attachments/123456789012345678/123456789012345678/IMG_7438.gif'; // <-- Replace with your actual GIF URL

    if (welcomeChannel) {
      const botMember = await member.guild.members.fetchMe();
      const perms = welcomeChannel.permissionsFor(botMember);
      if (!perms || !perms.has('SendMessages')) {
        console.error('❌ Bot lacks permission to send messages in #welcome.');
        return;
      }
      await welcomeChannel.send({ content: welcomeMessage, files: [gifUrl] });
      console.log(`Welcome message sent for ${member.user.tag}`);
    } else {
      console.log('Welcome channel not found');
    }
  } catch (error) {
    console.error('Error sending welcome message:', error);
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

// Fun, human-like, and joke-filled responses for the bot
const funReplies = [
  "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
  "I'm not lazy, I'm just on energy-saving mode. 😴",
  "If you see me talking to myself, just move along. I'm self-employed! 🤓",
  "Why don’t skeletons fight each other? They don’t have the guts! 💀",
  "I would tell you a construction joke, but I'm still working on it.",
  "Did someone say party? Because I just brought the confetti!",
  "I'm not a bot, I'm just a human with really fast typing skills. 🤖✨",
  "If laughter is the best medicine, you all owe me a co-pay! 😂",
  "I tried to catch some fog earlier. I mist. 🌫️",
  "Why did the math book look sad? Because it had too many problems. 📚",
  "I'm here all week, folks! Try the veal! 🍽️",
  "If you need a joke, just ping me. I have a database full of them! (Don’t tell the admins.) 🤫"
];

const playfulReplies = [
  `Hey there! Did you just summon me? Because I feel special now! ✨`,
  `Oh, it's you again! What's up? 😏`,
  `I'm not saying I'm the best bot, but... have you seen my dance moves? 💃`,
  `You type, I vibe. That's the deal. 😎`,
  `If I had a dollar for every message, I'd buy a new server! 💸`,
  `You talkin' to me? You must be talkin' to me! 🕶️`,
  `I see you. I see you. 👀`,
  `I was going to say something smart, but then I remembered I'm a Discord bot. Oops! 🤪`,
  `You ever just... exist? Same.`,
  `If you need a virtual hug, just ask! 🤗`
];

// Add a large array of random questions
const randomQuestions = [
  "What's your favorite movie?",
  "If you could travel anywhere, where would you go?",
  "What's the best thing you've eaten this week?",
  "Do you have any pets?",
  "What's your favorite hobby?",
  "If you could have any superpower, what would it be?",
  "What's a fun fact about you?",
  "What's your favorite game to play?",
  "If you could meet any celebrity, who would it be?",
  "What's your go-to comfort food?",
  "What's something that made you smile today?",
  "What's your favorite season?",
  "If you could instantly learn any skill, what would it be?",
  "What's your favorite song right now?",
  "Do you prefer cats or dogs?",
  "What's your favorite way to relax?",
  "What's a goal you're working on?",
  "If you could time travel, what year would you visit?",
  "What's your favorite animated emoji?",
  "What's the last show you binge-watched?",
  "What's your favorite holiday?",
  "If you could swap lives with anyone for a day, who would it be?",
  "What's your favorite thing about Discord?",
  "What's a talent you wish you had?",
  "What's your favorite meme?",
  "What's your favorite color?",
  "What's your favorite book?",
  "What's your favorite thing to do on weekends?",
  "If you could have dinner with anyone, living or dead, who would it be?",
  "What's your favorite ice cream flavor?",
  "What's a place you want to visit someday?",
  "What's your favorite quote?",
  "What's your favorite sport?",
  "What's your favorite animal?",
  "What's your favorite pizza topping?",
  "What's your favorite thing to cook or bake?",
  "What's your favorite subject in school?",
  "What's your favorite app on your phone?",
  "What's your favorite thing about yourself?",
  "What's your favorite way to spend a rainy day?",
  "What's your favorite emoji?",
  "What's your favorite thing to do with friends?",
  "What's your favorite snack?",
  "What's your favorite thing to watch on YouTube?",
  "What's your favorite thing to draw or create?",
  "What's your favorite way to exercise?",
  "What's your favorite thing to collect?",
  "What's your favorite thing to do outdoors?",
  "What's your favorite thing to do when you're bored?",
  "What's your favorite thing to do online?"
];

// Sentiment keywords
const positiveWords = [
  'happy', 'great', 'awesome', 'fantastic', 'good', 'amazing', 'love', 'excited', 'joy', 'yay', 'wonderful', 'cool', 'fun', 'best', 'nice', 'glad', 'smile', 'success', 'win', 'proud', 'celebrate'
];
const negativeWords = [
  'sad', 'tired', 'bad', 'depressed', 'unhappy', 'angry', 'mad', 'hate', 'cry', 'upset', 'bored', 'lonely', 'anxious', 'stress', 'stressed', 'worried', 'pain', 'hurt', 'fail', 'lost', 'sorry', 'problem', 'trouble', 'sick', 'ill', 'down', 'struggle', 'hard', 'difficult', 'frustrated', 'overwhelmed'
];

// Track recent user moods
const userMood = {};

function detectSentiment(text) {
  const lower = text.toLowerCase();
  if (negativeWords.some(word => lower.includes(word))) return 'negative';
  if (positiveWords.some(word => lower.includes(word))) return 'positive';
  return 'neutral';
}

// Simple conversation state tracking
const userConversationState = {};

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

// Helper to get dynamic AI response for any message type
async function getDynamicAIResponse(userMessage, contextType) {
  let systemPrompt = 'You are Benson, a friendly, supportive, and fun Discord bot.';
  if (contextType === 'support') {
    systemPrompt += ' The user seems sad or stressed. Respond with empathy, encouragement, or motivation.';
  } else if (contextType === 'celebrate') {
    systemPrompt += ' The user seems happy or excited. Respond with celebration, positivity, or fun.';
  } else if (contextType === 'random') {
    systemPrompt += ' Respond with a fun, playful, or motivational message. Keep it light and engaging.';
  }
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 120,
        temperature: 0.85
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
    console.error('Error getting dynamic AI response:', error);
    return null;
  }
}

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  try {
    const userId = message.author.id;
    const content = message.content.trim();
    const normalized = normalizeMessage(content);
    // Sentiment detection
    const sentiment = detectSentiment(content);
    userMood[userId] = sentiment;
    // Dynamic AI for supportive/celebratory/neutral
    let contextType = 'random';
    if (sentiment === 'negative') contextType = 'support';
    if (sentiment === 'positive') contextType = 'celebrate';
    // If message is a question, use original AI logic
    if (content.endsWith('?') || content.includes('?')) {
      await message.channel.sendTyping();
      let aiResponse = await getAIResponse(content);
      if (aiResponse) {
        aiResponse = aiResponse.replace(/How can I assist you today\??/gi, 'hru');
        await message.reply(aiResponse);
        userConversationState[userId] = 'asked_question';
        return;
      } else {
        await message.reply("Sorry, I'm having trouble thinking right now!");
        return;
      }
    }
    // Otherwise, use dynamic AI for all other messages
    await message.channel.sendTyping();
    let aiDynamic = await getDynamicAIResponse(content, contextType);
    if (aiDynamic) {
      await message.reply(aiDynamic);
    } else {
      // fallback to static reply if AI fails
      const allReplies = funReplies.concat(playfulReplies);
      const reply = allReplies[Math.floor(Math.random() * allReplies.length)];
      await message.reply(reply);
    }
    // Optionally, follow up with a random question to keep chat going
    if (Math.random() < 0.5) {
      const question = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
      await message.reply(question);
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