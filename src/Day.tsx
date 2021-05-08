import React from 'react';
import { css, cx } from 'emotion';

import { stylesFactory, useTheme } from '@grafana/ui';

import dayjs from 'dayjs';
import { GrafanaTheme } from '@grafana/data';
import AutoSizer from 'react-virtualized-auto-sizer';
import { CalendarEvent } from 'types';

interface Props {
  day: dayjs.Dayjs;
  weekend: boolean;
  today: boolean;
  events: Array<CalendarEvent | undefined>;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
  outsideInterval: boolean;
  from: dayjs.Dayjs;
  to: dayjs.Dayjs;
}

export const Day = ({ day, weekend, today, events, selected, onSelectionChange, outsideInterval }: Props) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  // A filler is added to offset entries that started on a day with previously
  // ongoing events.
  const filler = <div className={cx(styles.event, styles.multiDayEvent, styles.filler)}></div>;

  const eventStartsToday = (e: CalendarEvent): boolean => e.start.startOf('day').isSame(day);
  const eventEndsToday = (e: CalendarEvent): boolean =>
    e.end ? e.end.startOf('day').isSame(day) : e.end === undefined ? eventStartsToday(e) : false;

  const eventEntries = events.map(event => {
    if (!event) {
      return filler;
    }

    const startsToday = eventStartsToday(event);
    const endsToday = eventEndsToday(event);

    return startsToday && endsToday ? (
      <div className={cx(styles.event, styles.centerItems)}>
        <svg
          width={theme.spacing.xs}
          height={theme.spacing.xs}
          viewBox="0 0 10 10"
          xmlns="http://www.w3.org/2000/svg"
          fill={theme.palette.brandSuccess}
          className={css`
            margin-right: ${theme.spacing.xs};
          `}
        >
          <circle cx={5} cy={5} r={5} />
        </svg>
        <div
          className={cx(styles.eventLabel, {
            [css`
              color: ${theme.colors.textFaint};
            `]: outsideInterval,
          })}
        >
          {event.label}
        </div>
      </div>
    ) : (
      <div
        className={cx(styles.event, styles.multiDayEvent, {
          [styles.startDayStyle]: startsToday,
          [styles.endDayStyle]: endsToday && !event.open,
        })}
      >
        {/* Only display the event text on the day it starts. */}
        {startsToday && <div className={cx(styles.eventLabel)}>{event.label}</div>}
      </div>
    );
  });

  const dateHeader = (
    <div className={styles.dateHeader.root}>
      <div className={styles.dateHeader.monthLabel}>{day.format('D') === '1' && day.format('MMM')}</div>
      <div
        className={cx(
          styles.dateHeader.dayLabel,
          {
            [css`
              color: ${theme.colors.textWeak};
            `]: weekend,
          },
          {
            [css`
              color: ${theme.colors.textFaint};
            `]: outsideInterval,
          },
          {
            [css`
              background: ${theme.palette.queryRed};
              color: ${theme.palette.black};
            `]: today,
          },
          {
            [css`
              background: ${theme.colors.textBlue};
              color: ${theme.palette.black};
            `]: selected,
          }
        )}
      >
        {day.format('D')}
      </div>
    </div>
  );

  return (
    <div
      className={cx(
        styles.root,
        { [styles.weekend]: weekend },
        { [styles.today]: today },
        { [styles.selected]: selected },
        { [styles.outsideInterval]: outsideInterval }
      )}
      onClick={() => {
        onSelectionChange(!selected);
      }}
    >
      {dateHeader}

      <AutoSizer disableWidth>
        {({ height }) => {
          // TODO: Can we compute this rather than having it hard-coded?
          const heightPerEntry = 18;

          const maxNumEvents = Math.floor((height - 3 * heightPerEntry) / heightPerEntry);

          return (
            <>
              {eventEntries.filter((_, i) => i < maxNumEvents)}
              {eventEntries.length - maxNumEvents > 0 && (
                <div className={styles.moreEntriesLabel}>{`${eventEntries.length - maxNumEvents} more…`}</div>
              )}
            </>
          );
        }}
      </AutoSizer>
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
    outsideInterval: css`
      background: ${theme.colors.dashboardBg};
    `,
    today: css``,
    selected: css``,

    event: css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 1.5em;
      padding: 0 ${theme.spacing.xs};
      width: 100%;

      &:not(&:last-child) {
        margin-bottom: 1px;
      }
    `,
    eventLabel: css`
      font-size: ${theme.typography.size.sm};
      user-select: none;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    multiDayEvent: css`
      padding-left: ${theme.spacing.sm};
      background: ${theme.colors.textBlue};
      color: ${theme.palette.black};
    `,
    centerItems: css`
      display: flex;
      align-items: center;
    `,
    filler: css`
      background: transparent;
    `,
    moreEntriesLabel: css`
      font-size: ${theme.typography.size.sm};
      padding: ${theme.spacing.xs};
      user-select: none;
      color: ${theme.colors.textWeak};
    `,
    startDayStyle: css`
      width: calc(100% - ${theme.spacing.xs});
      margin-left: ${theme.spacing.xs};
      border-radius: ${theme.border.radius.lg} 0 0 ${theme.border.radius.lg};
    `,
    endDayStyle: css`
      width: calc(100% - ${theme.spacing.xs});
      border-radius: 0 ${theme.border.radius.lg} ${theme.border.radius.lg} 0;
    `,
    dateHeader: {
      root: css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: ${theme.spacing.xs};
      `,
      monthLabel: css`
        color: ${theme.palette.brandPrimary};
        font-weight: 500;
      `,
      dayLabel: css`
        color: ${theme.colors.textSemiWeak};
        border-radius: 50%;
        width: 3ch;
        height: 3ch;
        text-align: center;
        font-size: ${theme.typography.size.md};
        line-height: 3.1ch;
        user-select: none;
      `,
    },
  };
});
