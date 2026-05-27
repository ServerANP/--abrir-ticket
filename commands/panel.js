const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Muestra el panel para abrir tickets'),
    
    async execute(interaction) {
        // Crear embed del panel
        const panelEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎫 Sistema de Tickets')
            .setDescription('¡Bienvenido! Si necesitas ayuda, haz clic en el botón de abajo para abrir un ticket.\n\nNuestro equipo de soporte te atenderá lo antes posible.')
            .addFields(
                { name: '📋 ¿Qué es un ticket?', value: 'Un canal privado donde puedes comunicarte con nuestro equipo de soporte.' },
                { name: '⏱️ Tiempo de respuesta', value: 'Típicamente respondemos en menos de 1 hora.' },
                { name: '🔒 Privacidad', value: 'Tu ticket es privado y solo tú y el equipo de soporte pueden verlo.' }
            )
            .setFooter({ text: 'Haz clic en el botón para comenzar' })
            .setTimestamp();

        // Crear botón para abrir ticket
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('abrir_ticket')
                    .setLabel('🎫 Abrir Ticket')
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.reply({
            embeds: [panelEmbed],
            components: [row],
            ephemeral: false
        });
    },
};
