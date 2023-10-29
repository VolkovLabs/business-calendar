import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    svg: css`
      margin-right: ${theme.spacing(0.5)};
      width: ${theme.spacing(1)};
      min-width: ${theme.spacing(1)};
      height: ${theme.spacing(1)};
    `,
  };
};
