import React from 'react';

import { stylesFactory, useTheme } from '@grafana/ui';
import { css, cx } from 'emotion';
import { GrafanaTheme } from '@grafana/data';
import { CalendarEvent } from './types';
import dayjs from 'dayjs';

interface Props {
  event?: CalendarEvent;
  day: dayjs.Dayjs;
  outsideInterval: boolean;
  summary: boolean;
}

export const CalendarEntry = ({ event, day, outsideInterval, summary }: Props) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  // A filler is added to offset entries that started on a day with previously
  // ongoing events.
  const filler = <div className={cx(styles.event, styles.multiDayEvent, styles.filler)}></div>;

  if (!event) {
    return filler;
  }

  const eventStartsToday = (e: CalendarEvent): boolean => e.start.startOf('day').isSame(day);
  const eventEndsToday = (e: CalendarEvent): boolean =>
    e.end ? e.end.startOf('day').isSame(day) : e.end === undefined ? eventStartsToday(e) : false;

  const startsToday = eventStartsToday(event);
  const endsToday = eventEndsToday(event);

  return startsToday && endsToday ? (
    <div title={event.label} className={cx(styles.event, styles.centerItems)}>
      <svg
        width={theme.spacing.sm}
        height={theme.spacing.sm}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        fill={theme.palette.brandSuccess}
        className={css`
          margin-right: ${theme.spacing.xs};
          min-width: ${theme.spacing.sm};
          min-height: ${theme.spacing.sm};
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
      title={event.label}
      className={cx(styles.event, styles.multiDayEvent, {
        [styles.startDayStyle]: startsToday,
        [styles.endDayStyle]: endsToday && !event.open,
        [styles.summary]: summary,
      })}
    >
      {/* Only display the event text on the day it starts. */}
      {(startsToday || summary) && <div className={cx(styles.eventLabel)}>{event.label}</div>}
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    event: css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 1rem;
      padding: 0 ${theme.spacing.xs};
      width: 100%;

      &:not(&:last-child) {
        margin-bottom: 1px;
      }
    `,
    eventLabel: css`
      font-size: ${theme.typography.size.xs};
      user-select: none;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    multiDayEvent: css`
      padding-left: calc(3 * ${theme.spacing.xs});
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
    startDayStyle: css`
      width: calc(100% - ${theme.spacing.xs});
      margin-left: ${theme.spacing.xs};
      border-radius: ${theme.border.radius.lg} 0 0 ${theme.border.radius.lg};
    `,
    endDayStyle: css`
      width: calc(100% - ${theme.spacing.xs});
      border-radius: 0 ${theme.border.radius.lg} ${theme.border.radius.lg} 0;
    `,
    summary: css`
      width: calc(100% - 2 * ${theme.spacing.xs});
      margin-left: ${theme.spacing.xs};
      border-radius: ${theme.border.radius.lg};
    `,
  };
});
