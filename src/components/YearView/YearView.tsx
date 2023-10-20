import React, { useMemo } from 'react';
import { useStyles2 } from '@grafana/ui';
import { CalendarProps, DateLocalizer, Navigate, NavigateAction } from 'react-big-calendar';
import { YearViewMonth } from './YearViewMonth';
import { Styles } from './YearView.styles';

/**
 * Year View
 */
const YearView: React.FC<CalendarProps> = ({ date, localizer, ...restProps }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Week Names
   */
  const weekNames = useMemo(() => {
    let firstOfWeek = localizer.startOfWeek('');
    const date = new Date();
    let start = localizer.startOf(date, 'week', firstOfWeek);
    let end = localizer.endOf(date, 'week', firstOfWeek);

    const weekRange = localizer.range(start, end);

    return weekRange.map((date) => localizer.format(date, 'yearWeekFormat'));
  }, [localizer]);

  /**
   * Months
   */
  const months = [];
  const firstMonth = localizer.startOf(date as Date, 'year');

  for (let i = 0; i < 12; i++) {
    months.push(
      <YearViewMonth
        key={i + 1}
        date={localizer.add(firstMonth, i, 'month')}
        localizer={localizer}
        {...restProps}
        weekNames={weekNames}
      />
    );
  }

  return <div className={styles.year}>{months.map((month) => month)}</div>;
};

/**
 * Print Title
 * @param date
 * @param localizer
 */
(YearView as any).title = (date: Date, { localizer }: { localizer: DateLocalizer }) => {
  return localizer.format(date, 'yearHeaderFormat');
};

/**
 * Get Range
 * @param date
 * @param localizer
 */
(YearView as any).range = (date: Date, { localizer }: { localizer: DateLocalizer }) => {
  return [localizer.startOf(date, 'year')];
};

/**
 * Navigate
 * @param date
 * @param action
 * @param localizer
 */
(YearView as any).navigate = (date: Date, action: NavigateAction, { localizer }: { localizer: DateLocalizer }) => {
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
