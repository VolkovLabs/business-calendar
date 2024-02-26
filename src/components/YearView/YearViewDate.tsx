import { cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import React from 'react';
import { CalendarProps } from 'react-big-calendar';

import { TestIds } from '../../constants';
import { Styles } from './YearView.styles';

/**
 * Properties
 */
interface Props extends Required<Pick<CalendarProps, 'getNow' | 'localizer'>> {
  /**
   * Date Of Month
   */
  dateOfMonth: Date;

  /**
   * Date To Render
   */
  dateToRender: Date;

  /**
   * On Click
   */
  onClick: (date: Date) => void;
}

/**
 * Year View Date
 */
export const YearViewDate: React.FC<Props> = ({ dateToRender, dateOfMonth, localizer, getNow, onClick }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Is Today
   */
  const isToday = localizer.isSameDate(dateToRender, getNow() as Date);

  /**
   * Formatted Date
   */
  const text = localizer.format(dateToRender, 'yearDateFormat');

  /**
   * Previous Month Date
   */
  if (localizer.lt(dateToRender, dateOfMonth, 'month')) {
    return (
      <button
        disabled={true}
        className={cx(styles.date, styles.prevMonthDate)}
        data-testid={TestIds.yearView.prevDate(dateToRender.getMonth(), dateToRender.getDate())}
      >
        {text}
      </button>
    );
  }

  /**
   * Next Month Date
   */
  if (localizer.gt(dateToRender, dateOfMonth, 'month')) {
    return (
      <button
        disabled={true}
        className={cx(styles.date, styles.nextMonthDate)}
        data-testid={TestIds.yearView.nextDate(dateToRender.getMonth(), dateToRender.getDate())}
      >
        {text}
      </button>
    );
  }

  return (
    <button
      className={cx(styles.date, styles.inMonth, {
        [styles.today]: isToday,
      })}
      onClick={() => onClick(dateToRender)}
      data-testid={isToday ? TestIds.yearView.currentDate : TestIds.yearView.date(dateToRender.getDate())}
    >
      {text}
    </button>
  );
};
