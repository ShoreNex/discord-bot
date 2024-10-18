require('dotenv').config();
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { Octokit } = require('@octokit/rest');

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

client.login(process.env.DISCORD_TOKEN);
