import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2, textSize?: number) => {
  /**
   * Font Sizes
   */
  const dateFontSize = textSize ? `${textSize}px` : `80%`;
  const agendaFontSize = textSize ? `${textSize}px` : `90%`;
  const locationFontSize = textSize ? `${textSize}px` : theme.typography.bodySmall.fontSize;

  return {
    location: css`
      font-size: ${locationFontSize};
      margin: ${theme.spacing(0.5, 0.5)};
    `,
    date: css`
      font-size: ${dateFontSize};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: ${theme.spacing(0.5)};
      line-height: 1;
      padding: ${theme.spacing(0.25, 0)};
    `,
    info: css`
      margin-top: ${theme.spacing(0.5)};
      display: flex;
      flex-direction: column;
    `,
    title: css`
      font-weight: bold;
    `,
    agenda: css`
      display: flex;
      font-size: ${agendaFontSize};
      flex-direction: column;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1;
      cursor: pointer;
    `,
    text: css`
      margin: ${theme.spacing(0.5)};
    `,
  };
};
