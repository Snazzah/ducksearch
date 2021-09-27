import { commands } from './commands';
import { SlashCreator, CFWorkerServer } from './shim';

export const creator = new SlashCreator({
  applicationID: DISCORD_APP_ID,
  publicKey: DISCORD_PUBLIC_KEY,
  token: DISCORD_BOT_TOKEN
});

creator.withServer(new CFWorkerServer()).registerCommands(commands);

creator.on('warn', (message) => console.warn(message));
creator.on('error', (error) => console.error(error));
creator.on('commandRun', (command, _, ctx) =>
  console.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`)
);
creator.on('commandError', (command, error) => {
  console.error(`Command ${command.commandName} errored:`, error.stack || error.toString());
});

creator.on('componentInteraction', async (ctx) => {
  if (ctx.customID === 'delete') {
    if (ctx.message.interaction!.user.id !== ctx.user.id)
      return ctx.send({
        content: 'Only the person who executed this command can delete the response.',
        ephemeral: true
      });
    try {
      await ctx.acknowledge();
      await ctx.delete();
    } catch (e) {}
  }
});
