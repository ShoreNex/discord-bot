# Discord Bot

A Discord bot that interacts with users and fetches commit messages from a specified GitHub repository.

## Features

- Responds to the `!ping` command with "Pong!"
- Retrieves the last `N` commit messages from a specified GitHub repository when the command `history N` is issued.

## Requirements

- Node.js (version 16 or higher)
- npm (Node package manager)
- A Discord bot token
- A GitHub personal access token

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ShoreNex/discord-bot.git
2. Navigate to the project directory:

   ```bash
    cd discord-bot
    npm i or npm install

3. Then, create a .env file in the root directory and add your tokens:
   ```bash    
    DISCORD_TOKEN=your_discord_bot_token
    GITHUB_TOKEN=your_github_personal_access_token
4. To run the bot locally, use the following command:
   ```bash
    node index.js


