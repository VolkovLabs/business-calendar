import React, { useEffect, useState } from 'react';
import { CalendarProps, Week } from 'react-big-calendar';
import dayjs from 'dayjs';
import { useStyles2 } from '@grafana/ui';
import { createMonthDate } from './utils';
import { YearViewDate } from './YearViewDate';
import { Styles } from './YearView.styles';

/**
 * Month
 */
export const YearViewMonth: React.FC<CalendarProps> = ({ date, localizer, onNavigate, view }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Month state
   */
  const [month, setMonth] = useState(createMonthDate(date));

  useEffect(() => {
    setMonth(createMonthDate(date));
  }, [date]);

  if (!month) {
    return null;
  }

  return (
    <div className={styles.month}>
      <div className={styles.monthName}>{month.currentDate.format('MMMM').toUpperCase()}</div>
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
        <span key={index} className={styles.week}>
          {day}
        </span>
      ))}
      {month.map((week: Week[], index: number) => (
        <div key={index}>
          {week.map((date: any) => (
            <YearViewDate
              key={date.date()}
              dateToRender={date}
              dateOfMonth={month.currentDate}
              onClick={(date: dayjs.Dayjs) => {
                if (onNavigate) {
                  onNavigate(date.toDate(), view!, 'DATE');
                }
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
