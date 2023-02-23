import dayjs from 'dayjs';
import React from 'react';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { CalendarEvent } from '../../types';

/**
 * Properties
 */
interface Props {
  /**
   * Event
   */
  event: CalendarEvent;

  /**
   * Day
   */
  day: dayjs.Dayjs;

  /**
   * Outside Interval
   */
  outsideInterval: boolean;

  /**
   * On Click
   */
  onClick?: (e: any) => void;

  /**
   * Quick Links
   */
  quickLinks?: boolean;
}

/**
 * Calendar Entry
 */
export const CalendarEntry = ({ event, day, outsideInterval, onClick, quickLinks }: Props) => {
  const styles = useStyles2(getStyles);

  const eventStartsToday = (e: CalendarEvent): boolean => e.start.startOf('day').isSame(day);
  const eventEndsToday = (e: CalendarEvent): boolean =>
    e.end ? e.end.startOf('day').isSame(day) : e.end === undefined ? eventStartsToday(e) : false;

  const startOfWeek = day.startOf('day').isSame(day.startOf('isoWeek'));
  const endOfWeek = day.endOf('day').isSame(day.endOf('isoWeek'));
  const startsToday = eventStartsToday(event);
  const endsToday = eventEndsToday(event);

  /**
   * Link
   */
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

  /**
   * Today's event
   */
  if (startsToday && endsToday) {
    return (
      <Link title={event.text} className={styles.event.text} {...linkProps}>
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={event.color} className={styles.event.svg}>
          <circle cx={5} cy={5} r={5} />
        </svg>
        <div className={cx(styles.event.label, outsideInterval && styles.event.labelOutside)}>{event.text}</div>
      </Link>
    );
  }

  /**
   * Multi-day event
   * Display the event text on the day it starts.
   */
  return (
    <Link
      title={event.text}
      className={cx(
        styles.event.text,
        styles.event.multiDay,
        css`
          background: ${event.color};
        `,
        {
          [styles.event.startDay]: startOfWeek || startsToday,
          [styles.event.endDay]: endOfWeek || endsToday,
        }
      )}
      {...linkProps}
    >
      {(startOfWeek || startsToday) && <div className={cx(styles.event.label)}>{event.text}</div>}
    </Link>
  );
};
