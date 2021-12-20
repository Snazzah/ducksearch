import {
  AutocompleteResult,
  ImageColor,
  ImageLayout,
  ImageLicense,
  ImageSize,
  ImageType,
  SafeSearchType,
  search,
  searchImages,
  searchNews,
  SearchTimeType,
  searchVideos,
  VideoDefinition,
  VideoDuration,
  VideoLicense
} from 'duck-duck-scrape';
import {
  AutocompleteContext,
  SlashCommand,
  CommandOptionType,
  SlashCreator,
  CommandContext,
  ApplicationCommandOptionChoice
} from 'slash-create';
import { decode } from 'html-entities';
import { cutoffText, isChannelNSFW, IsChannelNSFWReason, quickLinkButton } from '../util';
import { stripIndents } from 'common-tags';

const SafeSearchChoices: ApplicationCommandOptionChoice[] = [
  {
    name: 'Strict',
    value: SafeSearchType.STRICT
  },
  {
    name: 'Moderate',
    value: SafeSearchType.MODERATE
  },
  {
    name: 'Off',
    value: SafeSearchType.OFF
  }
];

const MinimumSafeSearchChoices: ApplicationCommandOptionChoice[] = [
  {
    name: 'Strict',
    value: SafeSearchType.STRICT
  },
  {
    name: 'Off',
    value: SafeSearchType.OFF
  }
];

export default class SearchCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'search',
      description: 'Search with DuckDuckGo.',
      options: [
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'web',
          description: 'Search the web with DuckDuckGo.',
          options: [
            {
              type: CommandOptionType.STRING,
              name: 'query',
              description: 'The query to search.',
              required: true,
              autocomplete: true
            },
            {
              type: CommandOptionType.INTEGER,
              name: 'safesearch',
              description: 'The Safe Search setting for the search. Strict by default.',
              choices: SafeSearchChoices
            },
            {
              type: CommandOptionType.STRING,
              name: 'time',
              description: 'The time range of the searches to use.',
              choices: [
                {
                  name: 'All',
                  value: SearchTimeType.ALL
                },
                {
                  name: 'Last Day',
                  value: SearchTimeType.DAY
                },
                {
                  name: 'Last Week',
                  value: SearchTimeType.WEEK
                },
                {
                  name: 'Last Month',
                  value: SearchTimeType.MONTH
                },
                {
                  name: 'Last Year',
                  value: SearchTimeType.YEAR
                }
              ]
            },
            {
              type: CommandOptionType.BOOLEAN,
              name: 'ephemeral',
              description: 'Whether to only show results to you.'
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'images',
          description: 'Search images with DuckDuckGo.',
          options: [
            {
              type: CommandOptionType.STRING,
              name: 'query',
              description: 'The query to search.',
              required: true,
              autocomplete: true
            },
            {
              type: CommandOptionType.INTEGER,
              name: 'safesearch',
              description: 'The Safe Search setting for the search. Strict by default.',
              choices: MinimumSafeSearchChoices
            },
            {
              type: CommandOptionType.STRING,
              name: 'size',
              description: 'The size filter of the images to search.',
              choices: [
                {
                  name: 'All',
                  value: ImageSize.ALL
                },
                {
                  name: 'Small (< 200px)',
                  value: ImageSize.SMALL
                },
                {
                  name: 'Medium (200px - 500px)',
                  value: ImageSize.MEDIUM
                },
                {
                  name: 'Large (500px - 2000px)',
                  value: ImageSize.LARGE
                },
                {
                  name: 'Wallpaper (> 1200px)',
                  value: ImageSize.WALLPAPER
                }
              ]
            },
            {
              type: CommandOptionType.STRING,
              name: 'type',
              description: 'The type of the images to search.',
              choices: [
                {
                  name: 'Any',
                  value: ImageType.ALL
                },
                {
                  name: 'Photo',
                  value: ImageType.PHOTOGRAPH
                },
                {
                  name: 'Clipart',
                  value: ImageType.CLIPART
                },
                {
                  name: 'GIF',
                  value: ImageType.GIF
                },
                {
                  name: 'Transparent',
                  value: ImageType.TRANSPARENT
                }
              ]
            },
            {
              type: CommandOptionType.STRING,
              name: 'layout',
              description: 'The layout of the images to search.',
              choices: [
                {
                  name: 'Any',
                  value: ImageLayout.ALL
                },
                {
                  name: 'Square',
                  value: ImageLayout.SQUARE
                },
                {
                  name: 'Tall',
                  value: ImageLayout.TALL
                },
                {
                  name: 'Wide',
                  value: ImageLayout.WIDE
                }
              ]
            },
            {
              type: CommandOptionType.STRING,
              name: 'color',
              description: 'The color filter of the images to search.',
              choices: [
                {
                  name: 'Any',
                  value: ImageColor.ALL
                },
                {
                  name: 'Any with Color',
                  value: ImageColor.COLOR
                },
                {
                  name: 'Monochrome',
                  value: ImageColor.BLACK_AND_WHITE
                },
                {
                  name: 'Red',
                  value: ImageColor.RED
                },
                {
                  name: 'Orange',
                  value: ImageColor.ORANGE
                },
                {
                  name: 'Yellow',
                  value: ImageColor.YELLOW
                },
                {
                  name: 'Green',
                  value: ImageColor.GREEN
                },
                {
                  name: 'Blue',
                  value: ImageColor.BLUE
                },
                {
                  name: 'Pink',
                  value: ImageColor.PINK
                },
                {
                  name: 'Brown',
                  value: ImageColor.BROWN
                },
                {
                  name: 'Black',
                  value: ImageColor.BLACK
                },
                {
                  name: 'Gray',
                  value: ImageColor.GRAY
                },
                {
                  name: 'Teal',
                  value: ImageColor.TEAL
                },
                {
                  name: 'White',
                  value: ImageColor.WHITE
                }
              ]
            },
            {
              type: CommandOptionType.STRING,
              name: 'license',
              description: 'The license of the images to search.',
              choices: [
                {
                  name: 'Any',
                  value: ImageLicense.ALL
                },
                {
                  name: 'Creative Commons',
                  value: ImageLicense.CREATIVE_COMMONS
                },
                {
                  name: 'Public Domain',
                  value: ImageLicense.PUBLIC_DOMAIN
                },
                {
                  name: 'Free to share',
                  value: ImageLicense.SHARE
                },
                {
                  name: 'Free to share commercially',
                  value: ImageLicense.SHARE_COMMERCIALLY
                },
                {
                  name: 'Free to modify',
                  value: ImageLicense.MODIFY
                },
                {
                  name: 'Free to modify commercially',
                  value: ImageLicense.MODIFY_COMMERCIALLY
                }
              ]
            },
            {
              type: CommandOptionType.BOOLEAN,
              name: 'ephemeral',
              description: 'Whether to only show results to you.'
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'news',
          description: 'Search news articles with DuckDuckGo.',
          options: [
            {
              type: CommandOptionType.STRING,
              name: 'query',
              description: 'The query to search.',
              required: true,
              autocomplete: true
            },
            {
              type: CommandOptionType.INTEGER,
              name: 'safesearch',
              description: 'The Safe Search setting for the search. Strict by default.',
              choices: SafeSearchChoices
            },
            {
              type: CommandOptionType.STRING,
              name: 'time',
              description: 'The time range of the articles to use.',
              choices: [
                {
                  name: 'All',
                  value: SearchTimeType.ALL
                },
                {
                  name: 'Last Day',
                  value: SearchTimeType.DAY
                },
                {
                  name: 'Last Week',
                  value: SearchTimeType.WEEK
                },
                {
                  name: 'Last Month',
                  value: SearchTimeType.MONTH
                },
                {
                  name: 'Last Year',
                  value: SearchTimeType.YEAR
                }
              ]
            },
            {
              type: CommandOptionType.BOOLEAN,
              name: 'ephemeral',
              description: 'Whether to only show results to you.'
            }
          ]
        },
        {
          type: CommandOptionType.SUB_COMMAND,
          name: 'videos',
          description: 'Search videos with DuckDuckGo.',
          options: [
            {
              type: CommandOptionType.STRING,
              name: 'query',
              description: 'The query to search.',
              required: true,
              autocomplete: true
            },
            {
              type: CommandOptionType.INTEGER,
              name: 'safesearch',
              description: 'The Safe Search setting for the search. Strict by default.',
              choices: SafeSearchChoices
            },
            {
              type: CommandOptionType.STRING,
              name: 'time',
              description: 'The time range of the videos to use.',
              choices: [
                {
                  name: 'All',
                  value: SearchTimeType.ALL
                },
                {
                  name: 'Last Day',
                  value: SearchTimeType.DAY
                },
                {
                  name: 'Last Week',
                  value: SearchTimeType.WEEK
                },
                {
                  name: 'Last Month',
                  value: SearchTimeType.MONTH
                },
                {
                  name: 'Last Year',
                  value: SearchTimeType.YEAR
                }
              ]
            },
            {
              type: CommandOptionType.STRING,
              name: 'duration',
              description: 'The duration of the videos to filter.',
              choices: [
                {
                  name: 'Any',
                  value: VideoDuration.ANY
                },
                {
                  name: 'Short (> 5min)',
                  value: VideoDuration.SHORT
                },
                {
                  name: 'Medium (5-20 min)',
                  value: VideoDuration.MEDIUM
                },
                {
                  name: 'Long (< 20min)',
                  value: VideoDuration.LONG
                }
              ]
            },
            {
              type: CommandOptionType.STRING,
              name: 'license',
              description: 'The license of the videos to filter.',
              choices: [
                {
                  name: 'Any',
                  value: VideoLicense.ANY
                },
                {
                  name: 'Creative Commons',
                  value: VideoLicense.CREATIVE_COMMONS
                },
                {
                  name: 'YouTube Standard',
                  value: VideoLicense.YOUTUBE
                }
              ]
            },
            {
              type: CommandOptionType.STRING,
              name: 'resolution',
              description: 'The resolution of the videos to filter.',
              choices: [
                {
                  name: 'Any',
                  value: VideoDefinition.ANY
                },
                {
                  name: 'Standard definition',
                  value: VideoDefinition.STANDARD
                },
                {
                  name: 'High definition',
                  value: VideoDefinition.HIGH
                }
              ]
            },
            {
              type: CommandOptionType.BOOLEAN,
              name: 'ephemeral',
              description: 'Whether to only show results to you.'
            }
          ]
        }
      ]
    });
  }

  async autocomplete(ctx: AutocompleteContext) {
    if (ctx.focused === 'query') {
      const query = ctx.options[ctx.subcommands[0]].query;
      if (!query) return [];
      // Not sure why, but autocomplete on DDS will render error w/ "The script will never generate a response."
      const response = await fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&kl=wt-wt`);
      const results: AutocompleteResult[] = await response.json();
      return results.map((result) => ({ name: result.phrase, value: result.phrase })).slice(0, 20);
    }
    return [];
  }

  async run(ctx: CommandContext) {
    if (ctx.subcommands[0] === 'web') return this.searchWeb(ctx);
    if (ctx.subcommands[0] === 'images') return this.searchImages(ctx);
    if (ctx.subcommands[0] === 'news') return this.searchNews(ctx);
    if (ctx.subcommands[0] === 'videos') return this.searchVideos(ctx);

    return {
      content: 'Unknown subcommand.',
      ephemeral: true
    };
  }

  async determineNSFW(ctx: CommandContext) {
    const nsfwResult = await isChannelNSFW(ctx);
    if (
      nsfwResult.reason === IsChannelNSFWReason.RESPONSE_FAILED ||
      nsfwResult.reason === IsChannelNSFWReason.LIMIT_REACHED
    )
      return {
        content: 'I could not determine whether this channel is marked as NSFW. Try again later.',
        ephemeral: true
      };
    if (!nsfwResult.nsfw)
      return {
        content: 'You cannot change the Safe Search filter outside of NSFW channels.',
        ephemeral: true
      };
  }

  async searchWeb(ctx: CommandContext) {
    const ephemeral = ctx.options.web.ephemeral;
    const nsfw = ctx.options.web.safesearch !== undefined && ctx.options.web.safesearch !== SafeSearchType.STRICT;
    await ctx.defer(ephemeral);

    if (nsfw) {
      const response = await this.determineNSFW(ctx);
      if (response) return response;
    }

    const query = ctx.options.web.query;
    const results = await search(query, {
      safeSearch: ctx.options.web.safesearch === undefined ? SafeSearchType.STRICT : ctx.options.web.safesearch,
      time: ctx.options.web.time || SearchTimeType.ALL
    });

    if (results.noResults)
      return {
        content: 'No results were found for this query.',
        ephemeral
      };

    const topResult = results.results[0];
    await ctx.send({
      embeds: [
        {
          author: {
            icon_url: topResult.icon,
            name: topResult.hostname,
            url: 'https://' + topResult.hostname
          },
          url: topResult.url,
          title: decode(topResult.title),
          description: cutoffText(topResult.description.replace(/<\/?b>/g, '**'), 4096),
          footer: {
            text: `... ${results.results.length - 1} more result${results.results.length === 1 ? '' : 's'}`
          }
        }
      ],
      components: [
        quickLinkButton(
          {
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}&ia=web`,
            label: 'More on DuckDuckGo'
          },
          !ephemeral
        )
      ],
      ephemeral
    });
  }

  async searchImages(ctx: CommandContext) {
    const ephemeral = ctx.options.images.ephemeral;
    const nsfw = ctx.options.images.safesearch !== undefined && ctx.options.images.safesearch !== SafeSearchType.STRICT;
    await ctx.defer(ephemeral);

    if (nsfw) {
      const response = await this.determineNSFW(ctx);
      if (response) return response;
    }

    const query = ctx.options.images.query;
    const results = await searchImages(query, {
      safeSearch: ctx.options.images.safesearch === undefined ? SafeSearchType.STRICT : ctx.options.images.safesearch,
      color: ctx.options.images.color || ImageColor.ALL,
      license: ctx.options.images.license || ImageLicense.ALL,
      type: ctx.options.images.type || ImageType.ALL,
      size: ctx.options.images.size || ImageSize.ALL,
      layout: ctx.options.images.layout || ImageLayout.ALL
    });

    if (results.noResults && results.results.length === 0)
      return {
        content: 'No results were found for this query.',
        ephemeral
      };

    const topResult = results.results[0];
    await ctx.send({
      embeds: [
        {
          url: topResult.url,
          title: decode(topResult.title),
          image: { url: topResult.image },
          footer: {
            text: `[${topResult.width}x${topResult.height}]\n... ${results.results.length - 1} more result${
              results.results.length === 1 ? '' : 's'
            }`
          }
        }
      ],
      components: [
        quickLinkButton(
          {
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iar=images&iax=images&ia=images`,
            label: 'More on DuckDuckGo'
          },
          !ephemeral
        )
      ],
      ephemeral
    });
  }

  async searchNews(ctx: CommandContext) {
    const ephemeral = ctx.options.news.ephemeral;
    const nsfw = ctx.options.news.safesearch !== undefined && ctx.options.news.safesearch !== SafeSearchType.STRICT;
    await ctx.defer(ephemeral);

    if (nsfw) {
      const response = await this.determineNSFW(ctx);
      if (response) return response;
    }

    const query = ctx.options.news.query;
    const results = await searchNews(query, {
      safeSearch: ctx.options.news.safesearch === undefined ? SafeSearchType.STRICT : ctx.options.news.safesearch,
      time: ctx.options.news.time || SearchTimeType.ALL
    });

    if (results.noResults && results.results.length === 0)
      return {
        content: 'No results were found for this query.',
        ephemeral
      };

    const topResult = results.results[0];
    await ctx.send({
      embeds: [
        {
          url: topResult.url,
          title: decode(topResult.title),
          description: cutoffText(topResult.excerpt.replace(/<\/?b>/g, '**'), 4096),
          image: { url: topResult.image },
          footer: {
            text: `... ${results.results.length - 1} more result${results.results.length === 1 ? '' : 's'}`
          },
          timestamp: new Date(topResult.date * 1000)
        }
      ],
      components: [
        quickLinkButton(
          {
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iar=news&ia=news`,
            label: 'More on DuckDuckGo'
          },
          !ephemeral
        )
      ],
      ephemeral
    });
  }

  async searchVideos(ctx: CommandContext) {
    const ephemeral = ctx.options.videos.ephemeral;
    const nsfw = ctx.options.videos.safesearch !== undefined && ctx.options.videos.safesearch !== SafeSearchType.STRICT;
    await ctx.defer(ephemeral);

    if (nsfw) {
      const response = await this.determineNSFW(ctx);
      if (response) return response;
    }

    const query = ctx.options.videos.query;
    const results = await searchVideos(query, {
      safeSearch: ctx.options.videos.safesearch === undefined ? SafeSearchType.STRICT : ctx.options.videos.safesearch,
      time: ctx.options.videos.time || SearchTimeType.ALL,
      duration: ctx.options.videos.duration || VideoDuration.ANY,
      license: ctx.options.videos.license || VideoLicense.ANY,
      definition: ctx.options.videos.resolution || VideoDefinition.ANY
    });

    if (results.noResults && results.results.length === 0)
      return {
        content: 'No results were found for this query.',
        ephemeral
      };

    const topResult = results.results[0];
    await ctx.send({
      embeds: [
        {
          url: topResult.url,
          author: {
            name: topResult.publisher ? `${topResult.publisher} - ${topResult.publishedOn}` : topResult.publishedOn
          },
          title: decode(topResult.title),
          description: cutoffText(topResult.description, 4096),
          image: { url: topResult.image },
          footer: {
            text: stripIndents`
              ${topResult.duration}${
              topResult.viewCount
                ? ` - ${topResult.viewCount.toLocaleString()} view${topResult.viewCount === 1 ? '' : 's'}`
                : ''
            }
              ... ${results.results.length - 1} more result${results.results.length === 1 ? '' : 's'}
            `
          },
          timestamp: topResult.published
        }
      ],
      components: [
        quickLinkButton(
          {
            url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iar=videos&ia=videos`,
            label: 'More on DuckDuckGo'
          },
          !ephemeral
        )
      ],
      ephemeral
    });
  }

  async onError(err: Error, ctx: CommandContext) {
    console.error(err);
    return ctx.send({
      content: 'An error occurred with the API.\n' + err,
      ephemeral: true
    });
  }
}
