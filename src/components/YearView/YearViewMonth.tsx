import React, { useEffect, useState } from 'react';
import { CalendarProps } from 'react-big-calendar';
import { useStyles2 } from '@grafana/ui';
import { getMonth } from './utils';
import { YearViewDate } from './YearViewDate';
import { Styles } from './YearView.styles';

/**
 * Properties
 */
interface Props extends Omit<CalendarProps, 'date'> {
  date: Date;
  weekNames: string[];
}

/**
 * Month
 */
export const YearViewMonth: React.FC<Props> = ({ date, localizer, onDrillDown, getNow, weekNames }) => {
  /**
   * Styles
   */
  const styles = useStyles2(Styles);

  /**
   * Month state
   */
  const [month, setMonth] = useState(getMonth(date, localizer));

  /**
   * Update Months
   */
  useEffect(() => {
    setMonth(getMonth(date, localizer));
  }, [date, localizer]);

  if (!month.weeks) {
    return null;
  }

  return (
    <div className={styles.month}>
      <div className={styles.monthName}>{localizer.format(month.currentDate, 'yearMonthFormat').toUpperCase()}</div>
      {weekNames.map((weekName, index) => (
        <span key={index} className={styles.week}>
          {weekName}
        </span>
      ))}
      {month.weeks.map(({ week }, index: number) => (
        <div key={index}>
          {week.map((date, index) => (
            <YearViewDate
              key={index}
              dateToRender={date}
              dateOfMonth={month.currentDate}
              onClick={(date: Date) => {
                if (onDrillDown) {
                  onDrillDown(date, 'day');
                }
              }}
              localizer={localizer}
              getNow={getNow!}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
