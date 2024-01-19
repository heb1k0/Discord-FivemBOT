const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const conection = require('../../db/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('busuario')
        .setDescription('Buscar un usuario de la base de datos')
        .addSubcommand(subcommand =>
            subcommand
                .setName('nombre')
                .setDescription('Buscar un usuario por nombre de FIVEM')
                .addStringOption(option =>
                    option.setName('nombre')
                        .setDescription('Nombre del usuario')
                        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    ,
    async execute(interaction) {
        // devolver argumentos
        const nombre = interaction.options.getString('nombre')
        // contenga nombre o tenga
        await interaction.reply(`Buscando usuario ${nombre}...`);
        const query = await conection.query(`SELECT * FROM players WHERE name LIKE '%${nombre}%'`);
        // Devuelve un listado de usuarios
        query[0].forEach(element => {
            interaction.channel.send(`Nombre: ${element.name} | Identificador: ${element.license}`);
        });

    },
};