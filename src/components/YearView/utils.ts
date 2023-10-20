import { stringOrDate } from 'react-big-calendar';
import dayjs from 'dayjs';

/**
 * Create Month Date
 * @param calendarDate
 */
export const createMonthDate = (calendarDate?: stringOrDate) => {
  let currentDate = dayjs();
  if (calendarDate) {
    currentDate = dayjs(calendarDate);
  }

  const first = currentDate.startOf('month');
  const last = currentDate.endOf('month');
  const weeksCount = Math.ceil((first.day() + last.date()) / 7);
  const monthDate: any = Object.assign([], { currentDate, first, last });

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week: dayjs.Dayjs[] = [];
    monthDate.push(week);
    monthDate.year = currentDate.year();
    monthDate.month = currentDate.month();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date: dayjs.Dayjs & { monthDate?: unknown } = currentDate.set('date', day + 1 - first.day());
      date.monthDate = monthDate;
      week.push(date);
    }
  }

  return monthDate;
};
