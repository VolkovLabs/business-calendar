import { useState, useMemo, useCallback } from 'react';
import dayjs from 'dayjs';
import { Views, View } from 'react-big-calendar';
import { TimeRange, AbsoluteTimeRange } from '@grafana/data';

/**
 * Use Calendar Range
 * @param timeRange
 * @param onChangeTimeRange
 */
export const useCalendarRange = (timeRange: TimeRange, onChangeTimeRange: (timeRange: AbsoluteTimeRange) => void) => {
  const [view, setView] = useState<'month' | 'week' | 'day'>(Views.MONTH);
  const [calendarFrom, setCalendarFrom] = useState(timeRange.from.toDate());
  const [calendarTo, setCalendarTo] = useState(timeRange.to.toDate());

  /**
   * Middle date within the range to show current date in Calendar
   */
  const middleDate = useMemo(() => {
    return new Date((calendarTo.valueOf() + calendarFrom.valueOf()) / 2);
  }, [calendarFrom, calendarTo]);

  /**
   * Change Calendar View
   */
  const onChangeView = useCallback(
    (newView: View) => {
      switch (newView) {
        case 'month':
        case 'week':
        case 'day': {
          const { from, to } = timeRange;
          const newFrom = dayjs(middleDate).startOf(newView);
          const newTo = dayjs(middleDate).endOf(newView);

          /**
           * Change time range if one of dates are out of the current range
           */
          if (newFrom.valueOf() < from.valueOf() || newTo.valueOf() > to.valueOf()) {
            onChangeTimeRange({
              from: newFrom.valueOf(),
              to: newTo.valueOf(),
            });
          }

          setCalendarFrom(newFrom.toDate());
          setCalendarTo(newTo.toDate());
          setView(newView);
          break;
        }
      }
    },
    [onChangeTimeRange, middleDate, timeRange]
  );

  /**
   * Change Calendar Time Range
   */
  const onNavigate = useCallback(
    (newDate: Date, view: View) => {
      switch (view) {
        case 'month':
        case 'week':
        case 'day': {
          const { from, to } = timeRange;
          const newFrom = dayjs(newDate).startOf(view);
          const newTo = dayjs(newDate).endOf(view);

          /**
           * Change time range if one of dates are out of the current range
           */
          if (newFrom.valueOf() < from.valueOf() || newTo.valueOf() > to.valueOf()) {
            onChangeTimeRange({
              from: newFrom.valueOf(),
              to: newTo.valueOf(),
            });
          }

          setCalendarFrom(newFrom.toDate());
          setCalendarTo(newTo.toDate());

          return {
            from: newFrom.toDate(),
            to: newTo.toDate(),
          };
        }
        default: {
          return;
        }
      }
    },
    [onChangeTimeRange, timeRange]
  );

  return {
    date: middleDate,
    view,
    onChangeView,
    onNavigate,
  };
};
