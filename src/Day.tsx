import React from 'react';
import { css, cx } from 'emotion';

import { stylesFactory, useTheme } from '@grafana/ui';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { GrafanaTheme } from '@grafana/data';

dayjs.extend(isoWeek);

interface CalendarEntry {
  color: string;
  label: string;
}

interface Props {
  day: dayjs.Dayjs;
  weekend: boolean;
  today: boolean;
  entries: CalendarEntry[];
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

export const Day = ({ day, weekend, today, entries, selected, onSelectionChange }: Props) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const maxNumEntries = 5;

  return (
    <div
      className={cx(
        styles.root,
        { [styles.weekend]: weekend },
        { [styles.today]: today },
        { [styles.selected]: selected }
      )}
      onClick={() => {
        onSelectionChange(!selected);
      }}
    >
      <div
        className={cx(
          css`
            float: right;
          `
        )}
      >
        <div
          className={cx(
            css`
              float: right;
              color: ${theme.colors.textSemiWeak};
              border-radius: ${theme.border.radius.lg};
              font-size: ${theme.typography.size.md};
              margin: ${theme.spacing.xs};
              padding: 0.3em;
              padding-bottom: 0.1em;
              line-height: 1;
              user-select: none;
            `,
            {
              [css`
                color: ${theme.colors.textWeak};
              `]: weekend,
            },
            {
              [css`
                background: ${theme.palette.queryRed};
                color: ${theme.palette.black};
              `]: today,
            },
            {
              [css`
                background: ${theme.palette.blue95};
                color: ${theme.palette.black};
              `]: selected,
            }
          )}
        >
          {day.format('D')}
        </div>
      </div>
      <div
        className={css`
          padding: 0.3em 0.5em;
        `}
      >
        {day.format('D') === '1' && (
          <div
            className={css`
              color: ${theme.palette.brandPrimary};
              font-weight: 500;
            `}
          >
            {day.format('MMM')}
          </div>
        )}
        {entries
          .filter((_, i) => i < maxNumEntries)
          .map(_ => (
            <div className={styles.calendarEntry}>
              <svg width={5} height={5} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={_.color}>
                <circle cx={5} cy={5} r={5} />
              </svg>
              <div className={styles.calendarEntryLabel}>{_.label}</div>
            </div>
          ))}
        {entries.length - maxNumEntries > 0 && (
          <div className={styles.moreEntriesLabel}>{`${entries.length - maxNumEntries} more...`}</div>
        )}
      </div>
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    root: css`
      background: ${theme.colors.panelBg};
      border-top: 1px solid ${theme.colors.border2};
      border-left: 1px solid ${theme.colors.border2};
      overflow: hidden;

      &:nth-last-child(-n + 7) {
        border-bottom: 1px solid ${theme.colors.border2};
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
      background: ${theme.colors.bg2};
    `,
    today: css``,
    selected: css``,
    calendarEntry: css`
      display: flex;
      align-items: center;
      & > * {
        min-width: 5px;
      }
    `,
    calendarEntryLabel: css`
      font-size: ${theme.typography.size.sm};
      margin-left: ${theme.spacing.xs};
      user-select: none;
      box-sizing: border-box;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    moreEntriesLabel: css`
      font-size: ${theme.typography.size.sm};
      margin-left: 10px;
      user-select: none;
      color: ${theme.colors.textWeak};
    `,
  };
});
