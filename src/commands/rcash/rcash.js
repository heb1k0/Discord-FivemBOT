
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const conection = require('../../db/mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rcash')
        .setDescription('Quitar dinero a un usuario')
        .addStringOption(option =>
            option.setName('license')
                .setDescription('License del usuario')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad de dinero a quitar')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    ,
    async execute(interaction) {
        // devolver argumentos

        const Licenses = interaction.options.getString('license');
        const Cantidad = interaction.options.getInteger('cantidad');
        // comprobar si el usuario tiene permisos
        if (isNaN(Cantidad)) return interaction.editReply({ content: 'La cantidad no es un numero', components: [] });

        const CONFIRM_BUTTON_ID = 'confirm';
        const CANCEL_BUTTON_ID = 'cancel';


        // comprobar si el usuario existe
        const check = await conection.query(`SELECT * FROM players WHERE license = '${Licenses}'`);
        if (check.length == 0) return interaction.reply({ content: 'El usuario no existe', ephemeral: true });
        // añadir dinero al usuari
        const OBJ = JSON.parse(check[0][0].money);
        OBJ.bank = OBJ.bank - Cantidad;

        const confirm = new ButtonBuilder()
            .setCustomId(CONFIRM_BUTTON_ID)
            .setLabel(`Si quiero retirar ${Cantidad} dolares al usuario`)
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId(CANCEL_BUTTON_ID)
            .setLabel('No, cancelar')
            .setStyle(ButtonStyle.Danger);

        await interaction.deferReply({ ephemeral: true });

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        await interaction.editReply({ content: `¿Seguro que quieres retirar la cantidad de ${Cantidad} dolares a ${Licenses}`, components: [row] });
        // si cantidad no es un numero dar error

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId ===  CONFIRM_BUTTON_ID){
                const update = await conection.query(`UPDATE players SET money = '${JSON.stringify(OBJ)}' WHERE license = '${Licenses}'`);
                if (update[0].affectedRows == 0) return interaction.editReply({ content: 'Error al añadir el dinero', components: [] });
                await interaction.editReply({ content: 'Dinero retirado', components: [] });
            } else if (i.customId === CANCEL_BUTTON_ID) {
                await interaction.editReply({ content: 'Cancelado', components: [] });
            }
        });


    },
};