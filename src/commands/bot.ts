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
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'github',
          description: 'Get the GitHub repository link for ducksearch.'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    if (ctx.subcommands[0] === 'invite')
      return {
        content: 'Invite ducksearch by clicking the button!',
        components: [
          quickLinkButton(
            {
              label: 'Invite ducksearch',
              url: 'https://discord.com/oauth2/authorize?client_id=886879779318530058&permissions=0&scope=applications.commands%20bot'
            },
            false
          )
        ]
      };
    else if (ctx.subcommands[0] === 'github')
      return {
        content: 'View the source code of ducksearch by clicking the button!',
        components: [
          quickLinkButton(
            {
              label: 'View GitHub Repository',
              url: 'https://github.com/Snazzah/ducksearch'
            },
            false
          )
        ]
      };

    return {
      content: 'Unknown subcommand.',
      ephemeral: true
    };
  }
}
