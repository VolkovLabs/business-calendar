import dayjs, { OpUnitType } from 'dayjs';
import React from 'react';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { Styles } from '../../styles';
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

  /**
   * Display Time
   */
  displayTime: boolean;

  /**
   * First Day
   */
  firstDay: string;
}

/**
 * Calendar Entry
 */
export const CalendarEntry = ({ event, day, outsideInterval, onClick, quickLinks, displayTime, firstDay }: Props) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * A filler is added to offset entries that started on a day with previously ongoing events.
   */
  if (!event) {
    return (
      <div
        className={cx(styles.event.text, styles.event.multiDay, styles.event.filler)}
        data-testid={TestIds.calendarEntry.filler}
      />
    );
  }

  const startOfWeek = day.startOf('day').isSame(day.startOf(firstDay as OpUnitType));
  const startsToday = event.start.startOf('day').isSame(day);
  const endsToday = (event: CalendarEvent): boolean => {
    /**
     * Ends Today
     */
    if (event.end) {
      return event.end.startOf('day').isSame(day);
    }

    /**
     * Open Ended
     */
    if (event.end === undefined) {
      return event.start.startOf('day').isSame(day);
    }

    return false;
  };

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
  if (startsToday && endsToday(event)) {
    return (
      <Link
        title={event.text}
        className={styles.event.text}
        {...linkProps}
        data-testid={TestIds.calendarEntry.eventOneDay}
      >
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={event.color} className={styles.event.svg}>
          <circle cx={5} cy={5} r={5} />
        </svg>
        {!displayTime && (
          <div
            className={cx(styles.event.label, outsideInterval && styles.event.labelOutside)}
            data-testid={TestIds.calendarEntry.eventOneDayWithoutTime}
          >
            {event.text}
          </div>
        )}

        {displayTime && (
          <div
            className={cx(styles.event.label, outsideInterval && styles.event.labelOutside)}
            data-testid={TestIds.calendarEntry.eventOneDayWithTime}
          >
            {event.start.format('h:mma')} <b>{event.text}</b>
          </div>
        )}
      </Link>
    );
  }

  /**
   * Multi-day event.
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
          &:hover {
            background: ${event.color};
          }
        `,
        startsToday && styles.event.startDay,
        endsToday(event) && styles.event.endDay
      )}
      {...linkProps}
      data-testid={TestIds.calendarEntry.eventFewDays}
    >
      {startsToday && displayTime && (
        <div className={cx(styles.event.label)} data-testid={TestIds.calendarEntry.eventFewDaysWithTime}>
          {event.start.format('h:mma')} <b>{event.text}</b>
        </div>
      )}

      {startsToday && !displayTime && (
        <div className={cx(styles.event.label)} data-testid={TestIds.calendarEntry.eventFewDaysWithoutTime}>
          {event.text}
        </div>
      )}
      {startOfWeek && !startsToday && (
        <div className={cx(styles.event.label)} data-testid={TestIds.calendarEntry.eventFewDaysNotStartedToday}>
          {event.text}
        </div>
      )}
    </Link>
  );
};
