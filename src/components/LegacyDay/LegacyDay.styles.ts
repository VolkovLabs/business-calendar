import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    background: css`
      background: ${theme.colors.background};
      border-top: 1px solid ${theme.colors.border.medium};
      border-left: 1px solid ${theme.colors.border.medium};
      overflow: hidden;
      &:nth-child(7n + 1) {
        border-left: 0;
      }
      &:nth-child(-n + 7) {
        border-top: 0;
      }
    `,
    backgroundOutside: css`
      background: ${theme.colors.background.secondary};
    `,
    header: css`
      display: flex;
      justify-content: center;
      font-size: ${theme.typography.bodySmall.fontSize};
      margin: ${theme.spacing(0.5)};
      color: ${theme.colors.text.secondary};
      text-align: center;
      white-space: nowrap;
      user-select: none;
    `,
    text: css`
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: ${theme.typography.h2.fontSize};
      height: ${theme.typography.h3.fontSize};
    `,
    today: css`
      background: ${theme.colors.primary.main};
      color: ${theme.colors.background.primary};
    `,
    selected: css`
      background: ${theme.colors.secondary.main};
    `,
    outside: css`
      color: ${theme.colors.secondary.shade};
    `,
    moreLabel: css`
      font-size: ${theme.typography.bodySmall.fontSize};
      padding: 0 ${theme.spacing(1)};
      font-weight: ${theme.typography.fontWeightBold};
      user-select: none;
      cursor: pointer;
      &:hover {
        background: ${theme.colors.background.secondary};
        border-radius: ${theme.shape.borderRadius(2)};
      }
    `,
  };
};
