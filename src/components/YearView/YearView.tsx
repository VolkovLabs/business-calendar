import React, { useEffect, useState } from 'react';
import { useStyles2 } from '@grafana/ui';
import { CalendarProps, Navigate, NavigateAction, stringOrDate, Week } from 'react-big-calendar';
import dayjs from 'dayjs';
import { Styles } from './YearView.styles';

/**
 * Import doesn't work so use require
 */
const dateUtils = require('react-big-calendar/lib/utils/dates');

function createCalendar(calendarDate?: stringOrDate) {
  let currentDate = dayjs();
  if (calendarDate) {
    currentDate = dayjs(calendarDate);
  }

  const first = currentDate.startOf('month');
  const last = currentDate.endOf('month');
  const weeksCount = Math.ceil((first.day() + last.date()) / 7);
  const calendar: any = Object.assign([], { currentDate, first, last });

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week: dayjs.Dayjs[] = [];
    calendar.push(week);
    calendar.year = currentDate.year();
    calendar.month = currentDate.month();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date: dayjs.Dayjs & { calendar?: unknown } = currentDate.set('date', day + 1 - first.day());
      date.calendar = calendar;
      week.push(date);
    }
  }

  return calendar;
}

const CalendarDate = (props: any) => {
  const { dateToRender, dateOfMonth } = props;
  const today = dateToRender.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') ? 'today' : '';

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled={true} className="date prev-month">
        {dateToRender.date()}
      </button>
    );
  }

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled={true} className="date next-month">
        {dateToRender.date()}
      </button>
    );
  }

  return (
    <button className={`date in-month ${today}`} onClick={() => props.onClick(dateToRender)}>
      {dateToRender.date()}
    </button>
  );
};

const Calendar: React.FC<CalendarProps> = ({ date }) => {
  const [calendar, setCalendar] = useState(createCalendar(date));

  useEffect(() => {
    setCalendar(createCalendar(date));
  }, [date]);

  if (!calendar) {
    return null;
  }

  return (
    <div className="month">
      <div className="month-name">{calendar.currentDate.format('MMMM').toUpperCase()}</div>
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
        <span key={index} className="day">
          {day}
        </span>
      ))}
      {calendar.map((week: Week[], index: number) => (
        <div key={index}>
          {week.map((date: any) => (
            <CalendarDate
              key={date.date()}
              dateToRender={date}
              dateOfMonth={calendar.currentDate}
              onClick={(date: dayjs.Dayjs) => alert(`Will go to daily-view of ${date.format('YYYY-MM-DD')}`)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

class Year extends React.Component<any> {
  static range(date: stringOrDate) {
    return [dateUtils.startOf(date, 'year')];
  }

  static navigate(date: stringOrDate, action: NavigateAction) {
    switch (action) {
      case Navigate.PREVIOUS:
        return dateUtils.add(date, -1, 'year');

      case Navigate.NEXT:
        return dateUtils.add(date, 1, 'year');

      default:
        return date;
    }
  }

  static title(date: stringOrDate, { localizer }: any) {
    return localizer.format(date, 'yearHeaderFormat');
  }

  render() {
    let { date } = this.props;
    const months = [];
    const firstMonth = dateUtils.startOf(date, 'year');

    for (let i = 0; i < 12; i++) {
      months.push(<Calendar key={i + 1} date={dateUtils.add(firstMonth, i, 'month')} localizer={{} as any} />);
    }

    return <div className="year">{months.map((month) => month)}</div>;
  }
}

export { Year };
