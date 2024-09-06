import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';
import { CalendarProps, Event } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { getStyles } from './YearView.styles';

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

  dayEvents: Event[];
}

/**
 * Year View Date
 */
export const YearViewDate: React.FC<Props> = ({ dateToRender, dateOfMonth, dayEvents, localizer, getNow, onClick }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Is Today
   */
  const isToday = localizer.isSameDate(dateToRender, getNow() as Date);

  const dots = useMemo(() => {
    if (dayEvents.length <= 3) {
      return dayEvents.map((event) => (
        <span
          key={event.start?.toISOString()}
          className={cx(
            styles.dot,
            css`
              background-color: ${event.resource.color};
            `
          )}
        ></span>
      ));
    }

    const firstEvents = dayEvents.slice(0, 2);

    return (
      <>
        {firstEvents.map((event) => (
          <span
            key={event.start?.toISOString()}
            className={cx(
              styles.dot,
              css`
                background-color: ${event.resource.color};
              `
            )}
          ></span>
        ))}
        <span className={styles.plus}>+</span>
      </>
    );
  }, [dayEvents, styles]);

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
        data-testid={TEST_IDS.yearView.prevDate(dateToRender.getMonth(), dateToRender.getDate())}
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
        data-testid={TEST_IDS.yearView.nextDate(dateToRender.getMonth(), dateToRender.getDate())}
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
      data-testid={isToday ? TEST_IDS.yearView.currentDate : TEST_IDS.yearView.date(dateToRender.getDate())}
    >
      <div className={styles.dateContent}>
        {text}
        <div className={styles.dots}>{dots}</div>
      </div>
    </button>
  );
};
