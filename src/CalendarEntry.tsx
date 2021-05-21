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
  onClick?: (e: any) => void;
}

export const CalendarEntry = ({ event, day, outsideInterval, summary, onClick }: Props) => {
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

  const startOfWeek = day.startOf('day').isSame(day.startOf('isoWeek'));
  const endOfWeek = day.endOf('day').isSame(day.endOf('isoWeek'));
  const startsToday = eventStartsToday(event);
  const endsToday = eventEndsToday(event);

  return startsToday && endsToday ? (
    <div title={event.text} className={cx(styles.event, styles.centerItems)} onClick={onClick}>
      <svg
        width={theme.spacing.sm}
        height={theme.spacing.sm}
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        fill={event.color}
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
        {event.text}
      </div>
    </div>
  ) : (
    <div
      title={event.text}
      className={cx(
        styles.event,
        styles.multiDayEvent,
        css`
          background: ${event.color};
        `,
        {
          [styles.startDayStyle]: startOfWeek || startsToday,
          [styles.endDayStyle]: endOfWeek || endsToday,
          [styles.summary]: summary,
        }
      )}
      onClick={onClick}
    >
      {/* Only display the event text on the day it starts. */}
      {(startOfWeek || startsToday || summary) && <div className={cx(styles.eventLabel)}>{event.text}</div>}
    </div>
  );
};

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    event: css`
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 1.5rem;
      padding: 0 ${theme.spacing.xs};
      margin-bottom: 1px;

      color: ${theme.colors.textSemiWeak};

      &:hover {
        color: ${theme.colors.text};
        cursor: pointer;
      }
    `,
    eventLabel: css`
      font-size: ${theme.typography.size.base};
      font-weight: ${theme.typography.weight.semibold};
      r-select: none;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    multiDayEvent: css`
      padding-left: calc(4 * ${theme.spacing.xs});
      color: ${theme.palette.dark5};
      &:hover {
        color: ${theme.palette.black};
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
      border-radius: ${theme.border.radius.md} 0 0 ${theme.border.radius.md};
    `,
    endDayStyle: css`
      width: calc(100% - ${theme.spacing.sm});
      border-radius: 0 ${theme.border.radius.md} ${theme.border.radius.md} 0;
    `,
    summary: css`
      width: calc(100% - 2 * ${theme.spacing.xs});
      margin-left: ${theme.spacing.xs};
      border-radius: ${theme.border.radius.lg};
    `,
    tooltip: css`
      min-width: 200px;
      border-radius: ${theme.border.radius.md};
      background-color: ${theme.colors.bg2};
      padding: ${theme.spacing.sm};
      box-shadow: 0px 0px 20px ${theme.colors.dropdownShadow};
    `,
  };
});
