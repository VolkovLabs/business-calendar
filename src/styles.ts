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
    padding: ${theme.v1.spacing.sm};
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
    padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
    overflow: hidden;
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
  event: css`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 1.5rem;
    padding: 0 ${theme.spacing(1)};
    margin-bottom: 1px;
    color: ${theme.colors.text};
    &:hover {
      color: ${theme.v1.colors.textStrong};
      cursor: pointer;
    }
  `,
  eventLabel: css`
    font-size: ${theme.typography.body.fontSize};
    r-select: none;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  multiDayEvent: css`
    padding-left: calc(4 * ${theme.v1.spacing.xs});
    color: ${theme.v1.palette.dark5};
    &:hover {
      color: ${theme.v1.palette.black};
      cursor: pointer;
    }
  `,
  centerItems: css`
    display: flex;
    align-items: center;
  `,
  filler: css`
    background: transparent;
    &:hover {
      cursor: initial;
    }
  `,
  startDayStyle: css`
    border-radius: ${theme.v1.border.radius.md} 0 0 ${theme.v1.border.radius.md};
  `,
  endDayStyle: css`
    width: calc(100% - ${theme.v1.spacing.sm});
    border-radius: 0 ${theme.v1.border.radius.md} ${theme.v1.border.radius.md} 0;
  `,
  summary: css`
    width: calc(100% - 2 * ${theme.v1.spacing.xs});
    margin-left: ${theme.v1.spacing.xs};
    border-radius: ${theme.v1.border.radius.lg};
  `,
  tooltip: css`
    min-width: 200px;
    border-radius: ${theme.v1.border.radius.md};
    background-color: ${theme.v1.colors.bg2};
    padding: ${theme.v1.spacing.sm};
    box-shadow: 0px 0px 20px ${theme.v1.colors.dropdownShadow};
  `,
  day: css`
    background: ${theme.v1.colors.panelBg};
    border-top: 1px solid ${theme.v1.colors.border2};
    border-left: 1px solid ${theme.v1.colors.border2};
    overflow: hidden;
    &:nth-last-child(-n + 7) {
      border-bottom: 1px solid ${theme.v1.colors.border2};
    }
    &:nth-child(7n) {
    }
    &:nth-child(7n + 1) {
      border-left: 0;
    }
    &:nth-child(-n + 7) {
      border-top: 0;
    }
  `,
  weekend: css`
    background: ${theme.v1.colors.bg2};
  `,
  outsideInterval: css`
    background: ${theme.v1.colors.dashboardBg};
  `,
  today: css``,
  selected: css``,
  moreEntriesLabel: css`
    margin-top: 1px;
    display: inline-block;
    font-size: ${theme.typography.bodySmall.fontSize};
    padding: 0 ${theme.spacing(1)};
    font-weight: ${theme.typography.fontWeightBold};
    user-select: none;
    cursor: pointer;
    &:hover {
      background: ${theme.v1.colors.bg3};
      border-radius: 0 ${theme.v1.border.radius.lg} ${theme.v1.border.radius.lg} 0;
    }
  `,
  dateHeader: {
    root: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: ${theme.v1.spacing.xs};
    `,
    monthLabel: css`
      color: ${theme.v1.palette.brandPrimary};
      font-weight: 500;
    `,
    dayLabel: css`
      color: ${theme.v1.colors.textSemiWeak};
      border-radius: 50%;
      width: 3ch;
      height: 3ch;
      text-align: center;
      font-size: ${theme.typography.size.md};
      line-height: 3.1ch;
      user-select: none;
    `,
  },
});
