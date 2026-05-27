const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clima')
        .setDescription('Muestra el clima de una ciudad')
        .addStringOption(option =>
            option.setName('ciudad')
                .setDescription('Nombre de la ciudad')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        const ciudad = interaction.options.getString('ciudad');
        
        await interaction.deferReply();

        try {
            const weatherData = await getWeather(ciudad);

            if (!weatherData) {
                await interaction.editReply({
                    content: `❌ No se encontró la ciudad: **${ciudad}**`
                });
                return;
            }

            // Crear embed con información del clima
            const weatherEmbed = new EmbedBuilder()
                .setColor('#3498db')
                .setTitle(`🌍 Clima en ${weatherData.name}, ${weatherData.sys.country}`)
                .setDescription(`${weatherData.weather[0].main} - ${weatherData.weather[0].description}`)
                .addFields(
                    { 
                        name: '🌡️ Temperatura', 
                        value: `${Math.round(weatherData.main.temp)}°C (Sensación: ${Math.round(weatherData.main.feels_like)}°C)`, 
                        inline: true 
                    },
                    { 
                        name: '💧 Humedad', 
                        value: `${weatherData.main.humidity}%`, 
                        inline: true 
                    },
                    { 
                        name: '💨 Velocidad del Viento', 
                        value: `${weatherData.wind.speed} m/s`, 
                        inline: true 
                    },
                    { 
                        name: '🔽 Presión', 
                        value: `${weatherData.main.pressure} hPa`, 
                        inline: true 
                    },
                    { 
                        name: '👁️ Visibilidad', 
                        value: `${(weatherData.visibility / 1000).toFixed(1)} km`, 
                        inline: true 
                    },
                    { 
                        name: '☁️ Nubosidad', 
                        value: `${weatherData.clouds.all}%`, 
                        inline: true 
                    }
                )
                .setThumbnail(`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`)
                .setFooter({ text: 'Datos de OpenWeatherMap' })
                .setTimestamp();

            await interaction.editReply({
                embeds: [weatherEmbed]
            });

        } catch (error) {
            console.error('Error al obtener el clima:', error);
            await interaction.editReply({
                content: '❌ No pudimos obtener el clima en este momento. Intenta más tarde.'
            });
        }
    },
};

// Función para obtener datos del clima
function getWeather(city) {
    return new Promise((resolve, reject) => {
        const apiKey = '06f55e4e53f3e56a7e32eef0e8251c88'; // API key gratuita de OpenWeatherMap
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (jsonData.cod === 200) {
                        resolve(jsonData);
                    } else {
                        resolve(null);
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
