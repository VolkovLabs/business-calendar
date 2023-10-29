import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    text: css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 1.5rem;
      padding: 0 ${theme.spacing(1)};
      margin-bottom: 1px;
      color: ${theme.colors.text};
      &:hover {
        background: ${theme.colors.background.secondary};
        border-radius: ${theme.shape.borderRadius(2)};
        cursor: pointer;
      }
    `,
    multiDay: css`
      color: ${theme.colors.background.primary};
      &:hover {
        color: ${theme.colors.background.secondary};
      }
    `,
    filler: css`
      background: transparent;
      &:hover {
        cursor: initial;
      }
    `,
    label: css`
      font-size: ${theme.typography.body.fontSize};
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    labelOutside: css`
      color: ${theme.colors.text.secondary};
    `,
    svg: css`
      margin-right: ${theme.spacing(0.5)};
      width: ${theme.spacing(1)};
      min-width: ${theme.spacing(1)};
      height: ${theme.spacing(1)};
    `,
    startDay: css`
      border-radius: ${theme.shape.borderRadius(2)} 0 0 ${theme.shape.borderRadius(2)};
    `,
    endDay: css`
      border-radius: 0 ${theme.shape.borderRadius(2)} ${theme.shape.borderRadius(2)} 0;
      width: calc(100% - ${theme.spacing(1)});
    `,
  };
};
