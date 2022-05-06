module.exports = {
  ignorePatterns: ['node_modules', 'dist'],
  extends: 'snazzah',
  globals: {
    DISCORD_APP_ID: true,
    DISCORD_PUBLIC_KEY: true,
    DISCORD_BOT_TOKEN: true
  },
  overrides: [
    {
      files: ['slash-up.config.js'],
      env: {
        node: true
      }
    }
  ]
};
