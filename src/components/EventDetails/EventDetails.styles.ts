import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    svg: css`
      margin-right: ${theme.spacing(0.5)};
      width: ${theme.spacing(1)};
      min-width: ${theme.spacing(1)};
      height: ${theme.spacing(1)};
    `,
    labels: css`
      max-width: 300px;
      li {
        max-width: 100%;

        span {
          white-space: normal;
          display: block;
        }
      }
    `,
    labelsTooltip: css`
      justify-content: flex-start;
      li {
        max-width: 100%;

        span {
          white-space: normal;
          display: block;
        }
      }
    `,
    description: css`
      word-break: break-all;
      padding: ${theme.spacing(1)};
    `,
  };
};
