import React from 'react';
import { useStyles2 } from '@grafana/ui';
import { Navigate, NavigateAction, stringOrDate } from 'react-big-calendar';
import { YearViewMonth } from './YearViewMonth';
import { Styles } from './YearView.styles';

/**
 * Import doesn't work so require is used
 */
const dateUtils = require('react-big-calendar/lib/utils/dates');

const YearView: React.FC<any> = ({ date, ...restProps }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  const months = [];
  const firstMonth = dateUtils.startOf(date, 'year');

  for (let i = 0; i < 12; i++) {
    months.push(
      <YearViewMonth key={i + 1} date={dateUtils.add(firstMonth, i, 'month')} localizer={{} as any} {...restProps} />
    );
  }

  return <div className={styles.year}>{months.map((month) => month)}</div>;
};

(YearView as any).title = (date: stringOrDate, { localizer }: any) => {
  return localizer.format(date, 'yearHeaderFormat');
};

(YearView as any).range = (date: stringOrDate) => {
  return [dateUtils.startOf(date, 'year')];
};

(YearView as any).navigate = (date: stringOrDate, action: NavigateAction) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dateUtils.add(date, -1, 'year');

    case Navigate.NEXT:
      return dateUtils.add(date, 1, 'year');

    default:
      return date;
  }
};

export { YearView };
