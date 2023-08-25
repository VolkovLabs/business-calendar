import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    location: css`
      font-size: ${theme.typography.bodySmall.fontSize};
    `,
  };
};
