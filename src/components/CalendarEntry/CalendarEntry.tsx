import dayjs from 'dayjs';
import React from 'react';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { CalendarEvent } from '../../types';

/**
 * Properties
 */
interface Props {
  event?: CalendarEvent;
  day: dayjs.Dayjs;
  outsideInterval: boolean;
  summary: boolean;
  onClick?: (e: any) => void;
  quickLinks?: boolean;
}

/**
 * Calendar Entry
 */
export const CalendarEntry = ({ event, day, outsideInterval, summary, onClick, quickLinks }: Props) => {
  const theme = useTheme2().v1;
  const styles = useStyles2(getStyles);

  /**
   * A filler is added to offset entries that started on a day with previously ongoing events.
   */
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

  const firstLink = event.links?.[0];

  const Link = quickLinks ? 'a' : 'div';
  const linkProps = quickLinks
    ? {
        href: firstLink?.href,
        target: firstLink?.target,
        onClick: firstLink?.onClick,
      }
    : {
        onClick: onClick,
      };

  return startsToday && endsToday ? (
    <Link title={event.text} className={cx(styles.event, styles.centerItems)} {...linkProps}>
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
    </Link>
  ) : (
    <Link
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
      {...linkProps}
    >
      {/* Only display the event text on the day it starts. */}
      {(startOfWeek || startsToday || summary) && <div className={cx(styles.eventLabel)}>{event.text}</div>}
    </Link>
  );
};
