<!-- prettier-ignore-start -->
# 🎫 Discord Ticket Bot

Un bot de Discord para gestionar un sistema de tickets con botones interactivos.

## ✨ Características

- 🎫 **Panel de tickets** - Crea un panel bonito para abrir tickets
- 🔐 **Canales privados** - Cada ticket es un canal privado entre el usuario y el soporte
- ⚡ **Botones interactivos** - Abre y cierra tickets con un solo clic
- 🎨 **Embeds personalizados** - Mensajes bonitos y profesionales
- ✅ **Prevención de duplicados** - No puedes abrir dos tickets a la vez

## 🚀 Instalación

### 1. Crear el Bot en Discord Developer Portal

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en **"New Application"**
3. Dale un nombre (ej: `ANP Ticket Bot`)
4. Haz clic en **"Create"**

### 2. Copiar el Client ID

1. En **"GENERAL INFORMATION"**, busca **"APPLICATION ID"**
2. Haz clic en copiar y **guárdalo**

### 3. Crear el Token del Bot

1. En el menú izquierdo, haz clic en **"Bot"**
2. Si dice **"Add Bot"**, haz clic en ello
3. Bajo **"TOKEN"**, haz clic en **"Copy"**
4. **Guárdalo en un lugar seguro** (¡No lo compartas!)

### 4. Configurar Permisos

1. Ve a **"OAuth2"** → **"URL Generator"**
2. En **"SCOPES"**, marca: `bot`
3. En **"PERMISSIONS"**, marca:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Manage Channels
   - ✅ Manage Roles
   - ✅ Read Message History
   - ✅ View Channels
   - ✅ Mention @everyone, @here, and All Roles

4. Copia la URL generada y abre en tu navegador
5. Selecciona tu servidor y autoriza

### 5. Instalar Node.js

1. Ve a [nodejs.org](https://nodejs.org/)
2. Descarga la versión **LTS**
3. Instala (dale "Next" a todo)

### 6. Descargar el Código

```bash
git clone https://github.com/ServerANP/--abrir-ticket.git
cd --abrir-ticket
```

O descarga el ZIP desde GitHub.

### 7. Instalar Dependencias

```bash
npm install
```

### 8. Configurar Variables de Entorno

1. En la carpeta del bot, crea un archivo llamado `.env`
2. Pega esto (reemplaza con tus datos):

```
DISCORD_TOKEN=tu_token_aqui
DISCORD_CLIENT_ID=tu_client_id_aqui
```

**Ejemplo:**
```
DISCORD_TOKEN=MzgwMjU4OTMyNTk5MDI2Njg4.DT482w.SfpFjTi3IHshd7McGFFFKFgK8
DISCORD_CLIENT_ID=1234567890123456789
```

### 9. Registrar Comandos

```bash
npm run deploy
```

Deberías ver:
```
✅ Comandos registrados correctamente
```

### 10. Iniciar el Bot

```bash
npm start
```

Deberías ver:
```
✅ Bot iniciado como: ANP Ticket Bot#1234
```

## 📖 Uso

### Comando `/panel`

Crea un panel con el botón para abrir tickets:

```
/panel
```

Esto mostrará un embed bonito con un botón **"🎫 Abrir Ticket"**

### Comando `/ping`

Verifica que el bot está funcionando:

```
/ping
```

## 🎮 Cómo Funciona

1. **Usuario hace clic en "🎫 Abrir Ticket"**
   - Se crea un canal privado automáticamente
   - Solo el usuario y los administradores pueden verlo

2. **Usuario recibe el ticket**
   - Un embed de bienvenida
   - Un botón para cerrar el ticket

3. **Usuario cierra el ticket**
   - Hace clic en "🔒 Cerrar Ticket"
   - El canal se elimina en 5 segundos

## 📁 Estructura del Proyecto

```
--abrir-ticket/
├── index.js              # Bot principal
├── deploy-commands.js    # Script para registrar comandos
├── package.json          # Dependencias
├── .env                  # Variables de entorno (crea este)
├── .env.example          # Ejemplo de .env
├── .gitignore            # Archivos ignorados
├── README.md             # Este archivo
└── commands/
    ├── panel.js          # Comando /panel
    └── ping.js           # Comando /ping
```

## 🔧 Personalización

### Cambiar Colores de Embeds

En `index.js` y `commands/panel.js`, busca:
```javascript
.setColor('#0099ff')  // Cambia el color (código hexadecimal)
```

### Cambiar Nombres de Botones

En `index.js`, busca:
```javascript
.setLabel('🎫 Abrir Ticket')  // Cambia el texto del botón
```

### Agregar Roles de Soporte

En `index.js`, modifica la sección de permisos del canal:
```javascript
{
    id: ROLE_ID,
    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
}
```

## 🐛 Solucionar Problemas

### El bot no inicia
- Verifica que el `.env` existe en la carpeta raíz
- Verifica que el TOKEN y CLIENT ID son correctos
- Intenta: `npm install` nuevamente

### No aparecen los comandos
- Ejecuta: `npm run deploy`
- Espera 1-2 minutos
- Intenta `/` en Discord

### El bot no responde
- Verifica que el bot tiene permisos en el servidor
- Intenta reiniciar: `npm start`

## 📝 Licencia

MIT

## 👤 Autor

ServerANP

---

**¿Preguntas?** Abre un issue en GitHub. 🚀
