const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chiste')
        .setDescription('Obtiene un chiste aleatorio'),
    
    async execute(interaction) {
        await interaction.deferReply();

        try {
            // Obtener chiste de la API
            const joke = await getRandomJoke();

            // Crear embed del chiste
            const jokeEmbed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('😂 Chiste Aleatorio')
                .setDescription(joke)
                .setFooter({ text: '¡Espero que te haya hecho reír!' })
                .setTimestamp();

            await interaction.editReply({
                embeds: [jokeEmbed]
            });

        } catch (error) {
            console.error('Error al obtener el chiste:', error);
            await interaction.editReply({
                content: '❌ No pudimos obtener un chiste en este momento. Intenta más tarde.'
            });
        }
    },
};

// Función para obtener chiste de API externa
function getRandomJoke() {
    return new Promise((resolve, reject) => {
        https.get('https://v2.jokeapi.dev/joke/Any?lang=es', (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (jsonData.type === 'single') {
                        resolve(jsonData.joke);
                    } else {
                        resolve(`${jsonData.setup}\n\n${jsonData.delivery}`);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
