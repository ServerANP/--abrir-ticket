const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Cierra un ticket (Solo administradores)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const channel = interaction.channel;
        
        // Verificar si es un canal de ticket
        if (!channel.name.startsWith('ticket-')) {
            await interaction.reply({ 
                content: '❌ Este comando solo funciona en canales de tickets.', 
                ephemeral: true 
            });
            return;
        }

        await interaction.reply({ 
            content: '⏳ Cerrando ticket en 5 segundos...', 
            ephemeral: false 
        });

        setTimeout(async () => {
            try {
                await channel.delete();
                console.log(`🗑️ Ticket cerrado por administrador: ${channel.name}`);
            } catch (error) {
                console.error('Error al cerrar ticket:', error);
            }
        }, 5000);
    },
};
