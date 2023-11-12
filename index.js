const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Music'
           )
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

const { Client, Collection, Partials, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require('discord.js');

const config = require("./config.json");
const { glob } = require("glob");
const { promisify } = require("util");
const { joinVoiceChannel } = require('@discordjs/voice');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db');
const colors = require("colors");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember
  ],
  shards: "auto",
  allowedMentions: {
    parse: [],
    repliedUser: false
  },
})

client.setMaxListeners(25);
require('events').defaultMaxListeners = 25;

const { createLogger, transports, format } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, 'Logs', 'Errors.json') }),
  ],
});

client.on('error', error => {
  console.error('Discord.js error:', error);
  logger.error('Discord.js error:', error);
});

client.on('warn', warning => {
  console.warn('Discord.js warning:', warning);
});

let antiCrashLogged = false;

process.on('unhandledRejection', (reason, p) => {
  if (!antiCrashLogged) {
    console.error('[antiCrash] :: Unhandled Rejection/Catch');
    console.error(reason, p);
    logger.error('[antiCrash] :: Unhandled Rejection/Catch', { reason, p });
    antiCrashLogged = true;
  }
});

process.on('uncaughtException', (err, origin) => {
  if (!antiCrashLogged) {
    console.error('[antiCrash] :: Uncaught Exception/Catch');
    console.error(err, origin);
    logger.error('[antiCrash] :: Uncaught Exception/Catch', { err, origin });
    antiCrashLogged = true;
  }
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  if (!antiCrashLogged) {
    console.error('[antiCrash] :: Uncaught Exception/Catch (MONITOR)');
    console.error(err, origin);
    logger.error('[antiCrash] :: Uncaught Exception/Catch (MONITOR)', { err, origin });
    antiCrashLogged = true;
  }
});


module.exports = client;
client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
['commands', 'events', 'slash'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
})


setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  } else {
    console.log("Client Login")
  }
}, 5 * 1000 * 60);

client.login(config.token || process.env.token).catch((err) => {
  console.log(err.message)
})
