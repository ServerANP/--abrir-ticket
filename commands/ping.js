const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con el ping del bot'),
    
    async execute(interaction) {
        const latency = interaction.client.ws.ping;
        await interaction.reply(`🏓 Pong! Latencia: ${latency}ms`);
    },
};
