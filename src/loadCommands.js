const fs = require('node:fs');
const path = require('node:path');
const { Collection, REST, Routes } = require('discord.js');

module.exports = function loadCommands(client) {
    const commands = [];
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    client.commands = new Collection();

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                console.log(`[INFO] Cargado comando del archivo ${filePath}`);
                commands.push(command.data);
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    const rest = new REST().setToken(process.env.TOKEN);

    (async () => {
        try {
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    })();
};