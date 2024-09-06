import { useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';
import { CalendarProps, DateLocalizer, Event, Navigate, NavigateAction } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
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

    if (events) {
      events.forEach((event) => {
        if (event.start) {
          const monthCurrent = event.start.getMonth();
          monthsEvents[monthCurrent].push(event);
        }
      });
    }

    return monthsEvents;
  }, [events]);

  /**
   * Months
   */
  const months = [];
  const firstMonth = localizer.startOf(date as Date, 'year');

  for (let i = 0; i < 12; i++) {
    const month = localizer.add(firstMonth, i, 'month').getMonth();
    months.push(
      <YearViewMonth
        key={i + 1}
        date={localizer.add(firstMonth, i, 'month')}
        monthEvents={eventsByMonth[month]}
        localizer={localizer}
        {...restProps}
        weekNames={weekNames}
      />
    );
  }

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
