import { DateLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import { MonthDate } from '../../types';

/**
 * Get Month
 */
export const getMonth = (
  date: Date,
  localizer: DateLocalizer
): {
  currentDate: Date;
  first: Date;
  last: Date;
  weeks: MonthDate[];
} => {
  let currentDate = dayjs();
  if (date) {
    currentDate = dayjs(date);
  }

  const first = currentDate.startOf('month');

  /**
   * First day
   */
  const weekStartDay = localizer.startOfWeek('');
  const firstDayInPeriod =
    weekStartDay === 1 ? (first.day() - 1 >= 0 ? first.day() - 1 : 6 - first.day()) : first.day();

  const last = currentDate.endOf('month');
  const weeksCount = Math.ceil((firstDayInPeriod + last.date()) / 7);
  const weeks: MonthDate[] = [];

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week: Date[] = [];

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date: dayjs.Dayjs = currentDate.set('date', day + 1 - firstDayInPeriod);
      week.push(date.toDate());
    }

    weeks.push({
      year: currentDate.year(),
      month: currentDate.month(),
      week,
    });
  }

  return {
    currentDate: currentDate.toDate(),
    first: first.toDate(),
    last: last.toDate(),
    weeks,
  };
};
