module.exports = {
  token: process.env.DISCORD_BOT_TOKEN,
  applicationId: process.env.DISCORD_APP_ID,
  commandPath: './src/commands',
  env: {
    dev: {
      token: process.env.DEV_DISCORD_BOT_TOKEN,
      applicationId: process.env.DEV_DISCORD_APP_ID,
      globalToGuild: process.env.COMMANDS_DEV_GUILD
    }
  }
};
