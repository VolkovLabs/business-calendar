import React from 'react';
import { useStyles2 } from '@grafana/ui';
import { cx } from '@emotion/css';
import { CalendarProps } from 'react-big-calendar';
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

  if (localizer.lt(dateToRender, dateOfMonth, 'month')) {
    return (
      <button disabled={true} className={cx(styles.date, styles.prevMonthDate)}>
        {text}
      </button>
    );
  }

  if (localizer.gt(dateToRender, dateOfMonth, 'month')) {
    return (
      <button disabled={true} className={cx(styles.date, styles.nextMonthDate)}>
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
    >
      {text}
    </button>
  );
};
