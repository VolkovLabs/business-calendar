import React from 'react';
import { useStyles2 } from '@grafana/ui';
import { cx } from '@emotion/css';
import dayjs from 'dayjs';
import { Styles } from './YearView.styles';

/**
 * Calendar Date
 * @param props
 * @constructor
 */
export const YearViewDate = (props: any) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  const { dateToRender, dateOfMonth } = props;
  const today = dateToRender.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ? 'today' : '';

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled={true} className={cx(styles.date, styles.prevMonthDate)}>
        {dateToRender.date()}
      </button>
    );
  }

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled={true} className={cx(styles.date, styles.nextMonthDate)}>
        {dateToRender.date()}
      </button>
    );
  }

  return (
    <button
      className={cx(styles.date, styles.inMonth, {
        [styles.today]: !!today,
      })}
      onClick={() => props.onClick(dateToRender)}
    >
      {dateToRender.date()}
    </button>
  );
};
