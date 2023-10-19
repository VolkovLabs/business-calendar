import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => ({
  year: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  `,

  month: css`
    margin: 5px 5px 15px 5px;
  `,

  monthName: css`
    color: #ccbe88;
    font-weight: bold;
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
    background: white;
    border-radius: 50px;
    border: none;
    outline: none;

    &.in-month:hover {
      cursor: pointer;
      background: #ccbe88;
    }
    &.prev-month,
    &.next-month {
      color: grey;
    }
  `,

  today: css`
    background: #ccbe88;
  `,
});
