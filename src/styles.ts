import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const getStyles = (theme: GrafanaTheme2) => ({
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
    font-size: ${theme.typography.size.md};
    font-weight: ${theme.v1.typography.weight.regular};
    border-bottom: 1px solid ${theme.v1.colors.border2};
  `,
  weekdayLabel: css`
    text-align: right;
    padding: ${theme.v1.spacing.xxs} ${theme.v1.spacing.xs};
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
});
