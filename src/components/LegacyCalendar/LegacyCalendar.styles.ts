import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    panel: css`
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `,
    applyIntervalButton: css`
      position: absolute;
      bottom: 0;
      right: 0;
      padding: ${theme.spacing(1)};
      z-index: 1000;
    `,
    grid: css`
      width: 100%;
      display: grid;
      flex-grow: 1;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      grid-auto-rows: 20%;
      overflow: auto;
      user-select: none;
    `,
    weekday: css`
      width: 100%;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      font-size: ${theme.typography.body.fontSize};
      font-weight: ${theme.typography.body.fontWeight};
      border-bottom: 1px solid ${theme.colors.border.medium};
    `,
    weekdayLabel: css`
      text-align: center;
      font-size: ${theme.typography.bodySmall.fontSize};
      padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
      overflow: hidden;
      text-transform: uppercase;
      color: ${theme.colors.text.secondary};
    `,
  };
};
