import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { devGuild, quickLinkButton } from '../util';

export default class BotCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'bot',
      description: 'Bot-specific commands.',
      guildIDs: devGuild,
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'invite',
          description: 'Get the invite link for ducksearch.'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    if (ctx.subcommands[0] === 'invite')
      return {
        content: 'Invite ducksearch by clicking the button!',
        components: [
          quickLinkButton({
            label: 'Invite ducksearch',
            url: 'https://discord.com/oauth2/authorize?client_id=886879779318530058&permissions=0&scope=applications.commands%20bot'
          })
        ]
      };

    return {
      content: 'Unknown subcommand.',
      ephemeral: true
    };
  }
}
