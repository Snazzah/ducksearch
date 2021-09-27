import { ButtonStyle, ComponentActionRow, ComponentButtonLink, ComponentType } from 'slash-create';

// Dev guild stuff lives here so syncing doesn't cause TS errors
declare const COMMANDS_DEV_GUILD: string | undefined;
export const devGuild = typeof COMMANDS_DEV_GUILD !== 'undefined' ? [COMMANDS_DEV_GUILD] : undefined;

export function cutoffText(text: string, limit = 2000) {
  return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
}

export function quickLinkButton(
  btn: Omit<ComponentButtonLink, 'type' | 'style'>,
  includeDelete = true
): ComponentActionRow {
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
