import { dictionaryDefinition, dictionaryHyphenation, dictionaryPronunciation } from 'duck-duck-scrape';
import { decode } from 'html-entities';
import { CommandContext, CommandOptionType, SlashCommand, SlashCreator } from 'slash-create';

import { cutoffText, quickLinkButton } from '../util';

const PARTS_OF_SPEECH: Record<string, string> = {
  interjection: 'interj.',
  noun: 'n.',
  'intransitive verb': 'v.',
  'transitive verb': 'v.',
  adjective: 'adj.',
  adverb: 'adv.',
  verb: 'v.',
  pronoun: 'pro.',
  conjunction: 'conj.',
  preposition: 'prep.',
  'auxiliary-verb': 'v.',
  'noun-plural': 'n.',
  abbreviation: 'abbr.',
  'proper-noun': 'n.'
};

export default class DictionaryCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: 'define',
      description: 'Define a word.',
      options: [
        {
          type: CommandOptionType.STRING,
          name: 'word',
          description: 'The word to define.',
          required: true
        }
      ]
    });
  }

  _replaceHTMLTags(text: string) {
    return decode(
      text
        .replace(/<\/?(b|strong)>/g, '**')
        .replace(/<\/?(em|i)>/g, '*')
        .replace(/<xref>([^<>]+)<\/xref>/g, '[$1](https://www.wordnik.com/words/$1)')
    );
  }

  async run(ctx: CommandContext) {
    const definitions = await dictionaryDefinition(ctx.options.word);
    const definition = definitions[0];
    if (!definition)
      return {
        content: '❌ That word cannot be found!',
        ephemeral: true
      };

    const word = definition.word;
    const hyphenations = await dictionaryHyphenation(word);
    const hyphenation = hyphenations.length ? hyphenations.map((p) => p.text).join('•') : null;
    const pronunciations = await dictionaryPronunciation(word);
    const ahd = pronunciations.find((p) => p.rawType.startsWith('ahd'));
    const arpabet = pronunciations.find((p) => p.rawType === 'arpabet');
    const ipa = pronunciations.find((p) => p.rawType === 'IPA');

    return {
      embeds: [
        {
          title: cutoffText(`**${hyphenation || word}**${ahd ? ` *(${ahd.raw})*` : ''}`, 256),
          url: `https://www.wordnik.com/words/${word}`,
          description: `${definitions
            .filter((d) => d.text)
            .map((d) => `*${PARTS_OF_SPEECH[d.partOfSpeech!] || '-'}* ${this._replaceHTMLTags(d.text!)}`)
            .join('\n')}`,
          fields: [
            {
              name: 'Arpabet',
              value: arpabet ? arpabet.raw : '',
              inline: true
            },
            {
              name: 'IPA',
              value: ipa ? ipa.raw : '',
              inline: true
            }
          ].filter((v) => !!v.value)
        }
      ],
      components: [quickLinkButton({ label: 'More on Wordnik', url: `https://www.wordnik.com/words/${word}` })]
    };
  }
}
