import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => ({
  year: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    overflow: auto;
  `,

  month: css`
    margin: ${theme.spacing(1)};
  `,

  monthName: css`
    color: ${theme.colors.primary.main};
    font-weight: ${theme.typography.fontWeightBold};
    text-align: center;
  `,

  day: css`
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  `,

  date: css`
    width: 30px;
    height: 30px;
    background: ${theme.colors.background.primary};
    border-radius: 50px;
    border: none;
    outline: none;
  `,

  inMonth: css`
    &:hover {
      cursor: pointer;
      background: ${theme.colors.background.secondary};
    }
  `,

  prevMonthDate: css`
    color: ${theme.colors.text.disabled};
  `,
  nextMonthDate: css`
    color: ${theme.colors.text.disabled};
  `,

  today: css`
    background: ${theme.colors.background.canvas};
  `,

  week: css`
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-weight: ${theme.typography.fontWeightBold};
  `,
});
