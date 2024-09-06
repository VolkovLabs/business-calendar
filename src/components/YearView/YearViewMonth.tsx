import { useStyles2 } from '@grafana/ui';
import React, { useEffect, useState } from 'react';
import { CalendarProps, Event } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { View } from '../../types';
import { getMonth } from './utils';
import { getStyles } from './YearView.styles';
import { YearViewDate } from './YearViewDate';

/**
 * Properties
 */
interface Props extends Omit<CalendarProps, 'date'> {
  date: Date;
  weekNames: string[];
  monthEvents: Event[];
}

/**
 * Month
 */
export const YearViewMonth: React.FC<Props> = ({ date, localizer, onDrillDown, getNow, weekNames, monthEvents }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

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
    <div className={styles.month} data-testid={TEST_IDS.yearView.month(month.currentDate.getMonth())}>
      <div className={styles.monthName}>{localizer.format(month.currentDate, 'yearMonthFormat').toUpperCase()}</div>
      {weekNames.map((weekName, index) => (
        <span key={index} className={styles.week}>
          {weekName}
        </span>
      ))}
      {month.weeks.map(({ week }, index: number) => (
        <div key={index}>
          {week.map((date, index) => {
            const dayEvents = monthEvents.filter((event) => event.start?.getDate() === date.getDate());
            return (
              <YearViewDate
                key={index}
                dateToRender={date}
                dateOfMonth={month.currentDate}
                dayEvents={dayEvents}
                onClick={(date: Date) => {
                  if (onDrillDown) {
                    onDrillDown(date, View.YEAR as never);
                  }
                }}
                localizer={localizer}
                getNow={getNow!}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
