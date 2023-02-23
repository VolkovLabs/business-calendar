import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => ({
  panel: css`
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `,
  applyIntervalButton: css`
    position: absolute;
    bottom: 0;
    right: 0;
    padding: ${theme.spacing(1)};
    z-index: 1000;
  `,
  weekdayContainer: css`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    font-size: ${theme.typography.body.fontSize};
    font-weight: ${theme.typography.body.fontWeight};
    border-bottom: 1px solid ${theme.colors.border.medium};
  `,
  weekdayLabel: css`
    text-align: center;
    font-size: ${theme.typography.bodySmall.fontSize};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
    overflow: hidden;
    text-transform: uppercase;
    color: ${theme.colors.text.secondary};
  `,
  calendarContainer: css`
    width: 100%;
    display: grid;
    flex-grow: 1;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    grid-auto-rows: 20%;
    overflow: auto;
    user-select: none;
  `,
  event: {
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
    label: css`
      font-size: ${theme.typography.body.fontSize};
      r-select: none;
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
      height: ${theme.spacing(1)};
    `,
    multiDay: css`
      padding-left: calc(4 * ${theme.v1.spacing.xs});
      color: ${theme.v1.palette.dark5};
      &:hover {
        color: ${theme.v1.palette.black};
        cursor: pointer;
      }
    `,
    startDay: css`
      border-radius: ${theme.shape.borderRadius(2)} 0 0 ${theme.shape.borderRadius(2)};
    `,
    endDay: css`
      border-radius: 0 ${theme.shape.borderRadius(2)} ${theme.shape.borderRadius(2)} 0;
    `,
  },
  day: {
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
  },
});
