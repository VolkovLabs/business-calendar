import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

/**
 * Styles
 */
export const Styles = (theme: GrafanaTheme2) => {
  const borderColorOverrideSelectors = `
    .rbc-header,
    .rbc-header + .rbc-header,
    .rbc-month-view,
    .rbc-day-bg,
    .rbc-day-bg + .rbc-day-bg,
    .rbc-month-row + .rbc-month-row,
    .rbc-time-view,
    .rbc-time-header.rbc-overflowing,
    .rbc-time-header-content,
    .rbc-time-content,
    .rbc-timeslot-group,
    .rbc-time-content > * + * > *,
    .rbc-day-slot .rbc-time-slot
    `;
  return {
    global: {
      '.rbc-off-range-bg': {
        backgroundColor: theme.colors.background.secondary,
      },
      '.rbc-today': {
        backgroundColor: theme.colors.background.canvas,
      },
      [borderColorOverrideSelectors]: {
        borderColor: theme.colors.border.weak,
      },
      '.rbc-event': {
        backgroundColor: theme.colors.primary.main,
      },
    },
    toolbar: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${theme.spacing(1)};
      padding: ${theme.spacing(0.5)};
    `,
  };
};
