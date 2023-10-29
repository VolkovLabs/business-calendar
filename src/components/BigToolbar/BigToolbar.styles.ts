import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  return {
    toolbar: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)};
    `,
    div: css`
      display: flex;
      justify-content: space-between;
    `,
    prev: css`
      margin-left: ${theme.spacing(3)};
    `,
    date: css`
      font-size: ${theme.typography.h2.fontSize};
      font-weight: ${theme.typography.h2.fontWeight};
      margin: 0 ${theme.spacing(1)} ${theme.spacing(0.5)} ${theme.spacing(3)};
    `,
  };
};
