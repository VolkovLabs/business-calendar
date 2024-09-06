import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => ({
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

  dots: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  dot: css`
    height: 6px;
    width: 6px;
    border-radius: 50%;
    margin-right: 1px;
    display: inline-block;
  `,

  plus: css`
    font-weight: 700;
    line-height: 5px;
    margin-left: 1px;
    height: 6px;
    width: 6px;
    font-size: 10px;
  `,

  date: css`
    width: 35px;
    height: 35px;
    background: ${theme.colors.background.primary};
    border-radius: 50px;
    border: none;
    outline: none;
  `,

  dateContent: css`
    display: flex;
    flex-direction: column;
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
