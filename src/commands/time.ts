import { stripIndents } from 'common-tags';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { time, TimeLocation } from 'duck-duck-scrape';
import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from 'slash-create';
import { devGuild, quickLinkButton } from '../util';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

const EMOJI_CLOCK: Record<string, number> = {
  1: 0x1f550,
  2: 0x1f551,
  3: 0x1f552,
  4: 0x1f553,
  5: 0x1f554,
  6: 0x1f555,
  7: 0x1f556,
  8: 0x1f557,
  9: 0x1f558,
  10: 0x1f559,
  11: 0x1f55a,
  12: 0x1f55b,
  1.5: 0x1f55c,
  2.5: 0x1f55d,
  3.5: 0x1f55e,
  4.5: 0x1f55f,
  5.5: 0x1f560,
  6.5: 0x1f561,
  7.5: 0x1f562,
  8.5: 0x1f563,
  9.5: 0x1f564,
  10.5: 0x1f565,
  11.5: 0x1f566,
  12.5: 0x1f567
};

export default class TimeCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'time',
      description: 'Get the time of a location.',
      guildIDs: devGuild,
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'query',
          description: 'The location to search for.',
          required: true
        }
      ]
    });
  }

  emojiTime(location: TimeLocation) {
    const key = (location.time.datetime.hour % 12) + 1 + Math.round(location.time.datetime.minute / 60) * 0.5;
    return String.fromCodePoint(EMOJI_CLOCK[key]);
  }

  async run(ctx: CommandContext) {
    const query: string = ctx.options.query;
    const response = await time(query);
    if (!response.locations || !response.locations.length)
      return {
        content: 'Could not find any locations with that query!',
        ephemeral: true
      };

    const location = response.locations[0];
    const date = dayjs(location.time.iso).utcOffset(location.time.timezone.offset);
    return {
      content: stripIndents`
        :flag_${location.geo.country.id}: **${location.geo.name}, ${location.geo.state || location.geo.country.name}**
        ${this.emojiTime(location)} ${date.format('LLLL')}
        ${location.time.timezone.zonename} (${location.time.timezone.zoneabb}, ${location.time.timezone.offset})
      `,
      components: [
        quickLinkButton({
          label: 'View on timeanddate.com',
          url: `http://www.timeanddate.com/worldclock/city.html?n=${location.id}`
        })
      ]
    };
  }
}
