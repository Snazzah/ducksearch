import { oneLine, stripIndents } from 'common-tags';
import { currency } from 'duck-duck-scrape';
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';

import { quickLinkButton } from '../util';

export default class CurrencyCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'currency',
      description: 'Convert currency.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'from',
          description: 'The currency symbol to convert from.',
          required: true
        },
        {
          type: CommandOptionType.STRING,
          name: 'to',
          description: 'The currency symbol to convert to.',
          required: true
        },
        {
          type: CommandOptionType.NUMBER,
          name: 'amount',
          description: 'The amount of currency to convert.'
        },
        {
          type: CommandOptionType.BOOLEAN,
          name: 'expanded',
          description: 'Whether to show top conversions along with the primary conversion.'
        }
      ]
    });
  }

  async run(ctx: CommandContext) {
    const amount = ctx.options.amount || 1;
    if (amount <= 0)
      return {
        content: 'The amount cannot be less than 0!',
        ephemeral: true
      };

    const response = await currency(ctx.options.from, ctx.options.to, amount);
    const url = `http://www.xe.com/currencyconverter/convert/?Amount=${response.conversion['from-amount']}&From=${response.conversion['from-currency-symbol']}&To=${response.conversion['to-currency-symbol']}`;
    return {
      embeds: [
        {
          author: {
            name: `${response.conversion['from-currency-name']}`,
            icon_url: `https://github.com/transferwise/currency-flags/raw/master/src/flags/${response.conversion[
              'from-currency-symbol'
            ].toLowerCase()}.png`,
            url
          },
          description: oneLine`
            **${response.conversion['from-amount']}** ${response.conversion['from-currency-name']} (${response.conversion['from-currency-symbol']})
            \`→\`
            **${response.conversion['converted-amount']}** ${response.conversion['to-currency-name']} (${response.conversion['to-currency-symbol']})
          `,
          fields: [
            {
              name: 'Top Conversions',
              value: stripIndents`
                **${response.conversion['from-amount']}** ${response.conversion['from-currency-name']} (${
                response.conversion['from-currency-symbol']
              }) also converts to...
                ${response.topConversions
                  .map((conv) => `**${conv['converted-amount']}** ${conv['to-currency-name']} (${conv['to-currency-symbol']})`)
                  .join('\n')}
              `
            }
          ].filter(() => ctx.options.expanded)
        }
      ],
      components: [quickLinkButton({ url, label: 'More on xe.com' })]
    };
  }

  async onError(err: Error, ctx: CommandContext) {
    const msg = err.message;
    if (msg === 'ERROR: Invalid from_currency_symbol.')
      return ctx.send({
        content: 'The `from` currency is invalid.',
        ephemeral: true
      });
    else if (msg === 'ERROR: Invalid to_currency_symbol.')
      return ctx.send({
        content: 'The `to` currency is invalid.',
        ephemeral: true
      });
    else
      return ctx.send({
        content: 'An error occurred with the API.\n' + msg,
        ephemeral: true
      });
  }
}
