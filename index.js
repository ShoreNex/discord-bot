import { config } from 'dotenv';
config(); // Load environment variables

import { Client, GatewayIntentBits, Events, EmbedBuilder } from 'discord.js';
import { Octokit } from '@octokit/rest';

// Check if tokens are loaded correctly
if (!process.env.GITHUB_TOKEN || !process.env.DISCORD_TOKEN) {
    console.error('Environment variables GITHUB_TOKEN or DISCORD_TOKEN not set.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'ShoreNex'; 
const REPO_NAME = 'kubernetescode'; 
const octokit = new Octokit({ auth: GITHUB_TOKEN });

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.content === '!ping') {
        message.channel.send('Pong!');
        return;
    }

    if (message.content.startsWith('history ')) {
        const args = message.content.split(' ');
        const count = parseInt(args[1], 10);
        if (!isNaN(count)) {
            try {
                const { data: commits } = await octokit.rest.repos.listCommits({
                    owner: REPO_OWNER,
                    repo: REPO_NAME,
                    per_page: count,
                });

                const commitMessages = commits.map(commit => `**${commit.commit.message}** - *${commit.commit.author.name}*`).join('\n');
                const embed = new EmbedBuilder()
                    .setTitle(`Last ${count} Commit Messages`)
                    .setDescription(commitMessages)
                    .setColor('#0099ff');

                await message.channel.send({ embeds: [embed] });
            } catch (error) {
                console.error('Error while fetching commits or sending message:', error);
                message.channel.send('There was an error fetching commit messages.');
            }
        } else {
            message.channel.send('Please provide a valid number.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
    console.error('Error logging in to Discord:', error);
});
