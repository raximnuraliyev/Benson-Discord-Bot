# Benson Discord Bot

Welcome to **Benson**, your friendly, smart, and customizable Discord bot! Benson greets new members, says goodbye, and auto-replies to a wide range of chat triggers to keep your server lively and interactive.

---

## Features

-  **Welcome Messages**: Greets new users in `#welcome`.
-  **Farewell Messages**: Bids goodbye in `#goodbye`.
-  **Auto-Replies**: Instantly responds to common phrases and their short forms (e.g. `hi`, `gm`, `tyyy`, etc.).
-  **Fast & Lightweight**: No bloat, just pure chat fun!

---

## Quick Start

1. **Clone the repo & install dependencies:**
   ```bash
   git clone https://github.com/raximnuraliyev/Benson-Discord-Bot.git
   cd Benson-Discord-Bot
   npm install
   ```
2. **Set up your `.env` file:**
   ```env
   BOT_TOKEN=your_bot_token_here
   ```
3. **Create required channels:**
   - `#welcome` (for welcome messages)
   - `#goodbye` (for farewell messages)
4. **Run the bot:**
   ```bash
   npm start
   # or
   node index.js
   ```

---

## Setup Details

### 1. Create a Discord Application & Bot
- Go to the [Discord Developer Portal](https://discord.com/developers/applications)
- Click **New Application** → Name it (e.g., "Benson")
- Go to **Bot** → **Add Bot** → Copy the token

### 2. Enable Privileged Gateway Intents
- In the Bot settings, enable:
  - **SERVER MEMBERS INTENT**
  - **MESSAGE CONTENT INTENT**

### 3. Set Bot Permissions
- In **OAuth2 > URL Generator**:
  - Scopes: `bot`
  - Permissions: View Channels, Send Messages, Read Message History, Mention Everyone

---

## Environment Variables

| Variable   | Description                |
|------------|----------------------------|
| BOT_TOKEN  | Your Discord bot token     |

---

## Example Usage

- **Say hi:**
  > User: hi
  >
  > Bot: Hi there! 👋

- **Say thanks:**
  > User: tyy
  >
  > Bot: You're welcome! 😊

---

## Troubleshooting

- **Bot not responding?**
  - Check bot permissions and intents in the Developer Portal.
  - Ensure `#welcome` and `#goodbye` channels exist.
  - Verify your `.env` file and token.

- **Still stuck?**
  - Check the console for errors.
  - [Discord Developer Portal](https://discord.com/developers/applications)

---

## Contributing
Pull requests and suggestions are welcome! Open an issue or submit a PR to help improve Benson.

---

> Made with ❤️ by [raximnuraliyev](https://github.com/raximnuraliyev)