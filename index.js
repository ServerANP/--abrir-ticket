const { Client, GatewayIntentBits, Collection, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages
    ] 
});

// Cargar comandos
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando cargado: ${command.data.name}`);
    }
}

// Evento cuando el bot está listo
client.once('ready', () => {
    console.log(`✅ Bot iniciado como: ${client.user.tag}`);
    client.user.setActivity('tickets 🎫', { type: 'WATCHING' });
});

// DETECTOR DE INTERACCIONES (Comandos y Botones)
client.on('interactionCreate', async interaction => {
    // Si es un comando de barra (/)
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`Comando no encontrado: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: '❌ Hubo un error al ejecutar el comando.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Hubo un error al ejecutar el comando.', ephemeral: true });
            }
        }
    }

    // Si es la presión de un botón
    if (interaction.isButton()) {
        // BOTÓN PARA ABRIR TICKET
        if (interaction.customId === 'abrir_ticket') {
            const guild = interaction.guild;
            const user = interaction.user;

            // Evitar que responda tardado
            await interaction.deferReply({ ephemeral: true });

            // Verificar si el usuario ya tiene un ticket abierto
            const existingTicket = guild.channels.cache.find(
                ch => ch.name === `ticket-${user.username.toLowerCase()}` && ch.type === ChannelType.GuildText
            );

            if (existingTicket) {
                await interaction.editReply({ 
                    content: `⚠️ Ya tienes un ticket abierto: ${existingTicket}`, 
                    ephemeral: true 
                });
                return;
            }

            try {
                // Crear el canal privado para el ticket
                const ticketChannel = await guild.channels.create({
                    name: `ticket-${user.username.toLowerCase()}`,
                    type: ChannelType.GuildText,
                    topic: `Ticket de ${user.username} - ${new Date().toLocaleString('es-ES')}`,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel, 
                                PermissionFlagsBits.SendMessages, 
                                PermissionFlagsBits.ReadMessageHistory,
                                PermissionFlagsBits.AttachFiles
                            ],
                        }
                    ],
                });

                // Crear embed de bienvenida
                const welcomeEmbed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('🎫 Ticket Abierto')
                    .setDescription(`Bienvenido ${user}, el equipo de soporte te atenderá pronto.`)
                    .addFields(
                        { name: 'Usuario', value: `${user}`, inline: true },
                        { name: 'Hora de apertura', value: new Date().toLocaleString('es-ES'), inline: true },
                        { name: 'Estado', value: '🟢 Abierto', inline: true }
                    )
                    .setFooter({ text: 'Usa el botón de abajo para cerrar tu ticket cuando se resuelva.' })
                    .setTimestamp();

                // Botón para cerrar ticket
                const rowClose = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('cerrar_ticket')
                        .setLabel('🔒 Cerrar Ticket')
                        .setStyle(ButtonStyle.Danger)
                );

                await ticketChannel.send({
                    embeds: [welcomeEmbed],
                    components: [rowClose]
                });

                // Responder al usuario
                await interaction.editReply({ 
                    content: `✅ ¡Tu ticket ha sido creado en ${ticketChannel}!`, 
                    ephemeral: true 
                });

                console.log(`📝 Nuevo ticket creado: ${ticketChannel.name}`);

            } catch (error) {
                console.error('Error al crear ticket:', error);
                await interaction.editReply({ 
                    content: '❌ Hubo un error al crear el ticket. Intenta de nuevo.', 
                    ephemeral: true 
                });
            }
        }

        // BOTÓN PARA CERRAR TICKET
        if (interaction.customId === 'cerrar_ticket') {
            await interaction.reply({ 
                content: '⏳ Cerrando el ticket en 5 segundos...', 
                ephemeral: false 
            });

            setTimeout(async () => {
                try {
                    const channelName = interaction.channel.name;
                    await interaction.channel.delete();
                    console.log(`🗑️ Ticket cerrado: ${channelName}`);
                } catch (error) {
                    console.error('Error al cerrar ticket:', error);
                }
            }, 5000);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
