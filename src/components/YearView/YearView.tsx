import { useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';
import { CalendarProps, DateLocalizer, Event, Navigate, NavigateAction } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { filterEventsByYear } from '../../utils';
import { getStyles } from './YearView.styles';
import { YearViewMonth } from './YearViewMonth';

/**
 * Year View
 */
const YearView = ({ date, localizer, events, ...restProps }: CalendarProps) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Events for the current selected year
   */
  const yearEvents = useMemo(() => {
    return filterEventsByYear(events, date);
  }, [date, events]);

  /**
   * Week Names
   */
  const weekNames = useMemo(() => {
    const firstOfWeek = localizer.startOfWeek('');
    const date = new Date();
    const start = localizer.startOf(date, 'week', firstOfWeek);
    const end = localizer.endOf(date, 'week', firstOfWeek);

    const weekRange = localizer.range(start, end);

    return weekRange.map((date) => localizer.format(date, 'yearWeekFormat'));
  }, [localizer]);

  /**
   * Monthly events
   */
  const eventsByMonth = useMemo(() => {
    const monthsEvents: Record<number, Event[]> = {};
    for (let i = 0; i < 12; i++) {
      monthsEvents[i] = [];
    }

    if (yearEvents && !!yearEvents.length) {
      yearEvents.forEach((event) => {
        if (event.start) {
          const monthStart = event.start.getMonth();
          monthsEvents[monthStart].push(event);
          const monthEnd = event.end?.getMonth();

          if (monthEnd && monthEnd !== monthStart) {
            monthsEvents[monthEnd].push(event);
          }
        }
      });
    }

    return monthsEvents;
  }, [yearEvents]);

  /**
   * Months
   */
  const months = useMemo(() => {
    const firstMonth = localizer.startOf(date as Date, 'year');
    return Array.from(Array(12)).map((month, index) => {
      const monthDate = localizer.add(firstMonth, index, 'month');
      return (
        <YearViewMonth
          key={index + monthDate.toISOString()}
          date={monthDate}
          monthEvents={eventsByMonth[monthDate.getMonth()]}
          localizer={localizer}
          {...restProps}
          weekNames={weekNames}
        />
      );
    });
  }, [date, localizer, eventsByMonth, restProps, weekNames]);

  return (
    <div className={styles.year} data-testid={TEST_IDS.yearView.root}>
      {months.map((month) => month)}
    </div>
  );
};

/**
 * Print Title
 * @param date
 * @param localizer
 */
YearView.title = (date: Date, { localizer }: { localizer: DateLocalizer }) => {
  return localizer.format(date, 'yearHeaderFormat');
};

/**
 * Get Range
 * @param date
 * @param localizer
 */
YearView.range = (date: Date, { localizer }: { localizer: DateLocalizer }) => {
  return [localizer.startOf(date, 'year')];
};

/**
 * Navigate
 * @param date
 * @param action
 * @param localizer
 */
YearView.navigate = (date: Date, action: NavigateAction, { localizer }: { localizer: DateLocalizer }) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, 'year');

    case Navigate.NEXT:
      return localizer.add(date, 1, 'year');

    default:
      return date;
  }
};

export { YearView };
