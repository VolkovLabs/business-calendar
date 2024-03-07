import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => {
  return {
    location: css`
      font-size: ${theme.typography.bodySmall.fontSize};
    `,
    date: css`
      font-size: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: ${theme.spacing(0.5)};
      line-height: 1;
      padding: ${theme.spacing(0.25, 0)};
    `,
  };
};
