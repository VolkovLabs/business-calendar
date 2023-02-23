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
  eventSvg: css`
    margin-right: ${theme.spacing(0.5)};
    width: ${theme.spacing(1)};
    height: ${theme.spacing(1)};
  `,
  eventOutside: css`
    color: ${theme.colors.text.secondary};
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
  dayHeader: css`
    display: flex;
    justify-content: center;
    font-size: ${theme.typography.bodySmall.fontSize};
    margin: ${theme.spacing(0.5)};
    color: ${theme.colors.text.secondary};
    text-align: center;
    white-space: nowrap;
    user-select: none;
  `,
  dayStyle: css`
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: ${theme.typography.h2.fontSize};
    height: ${theme.typography.h3.fontSize};
  `,
});
