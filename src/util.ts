import { ButtonStyle, CommandContext, ComponentActionRow, ComponentButtonLink, ComponentType } from 'slash-create';

export function cutoffText(text: string, limit = 2000) {
  return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
}

export function quickLinkButton(btn: Omit<ComponentButtonLink, 'type' | 'style'>, includeDelete = true): ComponentActionRow {
  return {
    type: ComponentType.ACTION_ROW,
    components: includeDelete
      ? [
          {
            type: ComponentType.BUTTON,
            style: ButtonStyle.DESTRUCTIVE,
            custom_id: 'delete',
            label: '',
            emoji: { id: '887142796560060426' }
          },
          {
            type: ComponentType.BUTTON,
            style: ButtonStyle.LINK,
            ...btn
          }
        ]
      : [
          {
            type: ComponentType.BUTTON,
            style: ButtonStyle.LINK,
            ...btn
          }
        ]
  };
}

// eslint-disable-next-line no-undef
declare const CHANNEL_NSFW_CACHE: KVNamespace;

export interface DiscordChannel {
  id: string;
  type: DiscordChannelType;
  nsfw?: boolean;
}

export enum DiscordChannelType {
  GUILD_TEXT = 0,
  DM = 1,
  GUILD_VOICE = 2,
  GROUP_DM = 3,
  GUILD_CATEGORY = 4,
  GUILD_NEWS = 5,
  GUILD_STORE = 6,
  GUILD_NEWS_THREAD = 10,
  GUILD_PUBLIC_THREAD = 11,
  GUILD_PRIVATE_THREAD = 12,
  GUILD_STAGE_VOICE = 13
}

export enum IsChannelNSFWReason {
  NOT_NSFW,
  LIMIT_REACHED,
  RESPONSE_FAILED,
  IN_DIRECT_MESSAGE
}

export type IsChannelNSFWResult = { nsfw: true } & { nsfw: false; reason?: IsChannelNSFWReason };

declare const DISCORD_BOT_TOKEN: string;
export async function isChannelNSFW(ctx: CommandContext) {
  if (!ctx.guildID) return { nsfw: false, reason: IsChannelNSFWReason.IN_DIRECT_MESSAGE };
  const value = await CHANNEL_NSFW_CACHE.get(ctx.channelID);
  if (value !== null) return { nsfw: Boolean(Number(value)) };

  const response = await fetch(`https://discord.com/api/v9/guilds/${ctx.guildID}/channels`, {
    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
  });

  if (!response.ok) return { nsfw: false, reason: IsChannelNSFWReason.RESPONSE_FAILED };

  const channels: DiscordChannel[] = await response.json();
  let isNSFW = false;
  for (const channel of channels) {
    if (
      [
        DiscordChannelType.GUILD_CATEGORY,
        DiscordChannelType.GUILD_STORE,
        DiscordChannelType.GUILD_VOICE,
        DiscordChannelType.GUILD_STAGE_VOICE,
        DiscordChannelType.GROUP_DM,
        DiscordChannelType.GUILD_NEWS_THREAD,
        DiscordChannelType.GUILD_PRIVATE_THREAD,
        DiscordChannelType.GUILD_PUBLIC_THREAD,
        DiscordChannelType.DM
      ].includes(channel.type)
    )
      continue;
    if (ctx.channelID === channel.id) isNSFW = !!channel.nsfw;
    await CHANNEL_NSFW_CACHE.put(channel.id, String(Number(!!channel.nsfw)), { expirationTtl: 1800 });
  }
  return { nsfw: isNSFW };
}
