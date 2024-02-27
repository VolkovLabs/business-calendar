import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import dayjs, { OpUnitType } from 'dayjs';
import React, { MouseEvent } from 'react';

import { TEST_IDS } from '../../constants';
import { CalendarEvent } from '../../types';
import { getStyles } from './LegacyEventEntry.styles';

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
  onClick?: (e: MouseEvent) => void;

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
export const LegacyCalendarEntry = ({
  event,
  day,
  outsideInterval,
  onClick,
  quickLinks,
  displayTime,
  firstDay,
}: Props) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * A filler is added to offset entries that started on a day with previously ongoing events.
   */
  if (!event) {
    return (
      <div className={cx(styles.text, styles.multiDay, styles.filler)} data-testid={TEST_IDS.calendarEntry.filler} />
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
      <Link title={event.text} className={styles.text} {...linkProps} data-testid={TEST_IDS.calendarEntry.eventOneDay}>
        <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={event.color} className={styles.svg}>
          <circle cx={5} cy={5} r={5} />
        </svg>
        {!displayTime && (
          <div
            className={cx(styles.label, outsideInterval && styles.labelOutside)}
            data-testid={TEST_IDS.calendarEntry.eventOneDayWithoutTime}
          >
            {event.text}
          </div>
        )}

        {displayTime && (
          <div
            className={cx(styles.label, outsideInterval && styles.labelOutside)}
            data-testid={TEST_IDS.calendarEntry.eventOneDayWithTime}
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
        styles.text,
        styles.multiDay,
        css`
          background: ${event.color};
          &:hover {
            background: ${event.color};
          }
        `,
        startsToday && styles.startDay,
        endsToday(event) && styles.endDay
      )}
      {...linkProps}
      data-testid={TEST_IDS.calendarEntry.eventFewDays}
    >
      {startsToday && displayTime && (
        <div className={cx(styles.label)} data-testid={TEST_IDS.calendarEntry.eventFewDaysWithTime}>
          {event.start.format('h:mma')} <b>{event.text}</b>
        </div>
      )}

      {startsToday && !displayTime && (
        <div className={cx(styles.label)} data-testid={TEST_IDS.calendarEntry.eventFewDaysWithoutTime}>
          {event.text}
        </div>
      )}
      {startOfWeek && !startsToday && (
        <div className={cx(styles.label)} data-testid={TEST_IDS.calendarEntry.eventFewDaysNotStartedToday}>
          {event.text}
        </div>
      )}
    </Link>
  );
};
