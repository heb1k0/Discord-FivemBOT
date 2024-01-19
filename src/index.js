const dotenv = require('dotenv');
dotenv.config();

const { Client, Events, GatewayIntentBits } = require('discord.js');
const loadCommands = require('./loadCommands');
const handleInteraction = require('./handleInteraction');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
    console.log(`🚀[BOT READY] ${readyClient.user.tag}🚀`);
});

client.on(Events.InteractionCreate, handleInteraction);

client.login(process.env.TOKEN);

loadCommands(client);