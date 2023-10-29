import React, { useEffect, useState } from 'react';
import { CalendarProps } from 'react-big-calendar';
import { useStyles2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { View } from '../../types';
import { getMonth } from './utils';
import { Styles } from './YearView.styles';
import { YearViewDate } from './YearViewDate';

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

  return (
    <div className={styles.month} data-testid={TestIds.yearView.month(month.currentDate.getMonth())}>
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
                  onDrillDown(date, View.YEAR as any);
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
