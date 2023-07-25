import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigateAction, View, Views } from 'react-big-calendar';
import { AbsoluteTimeRange, TimeRange } from '@grafana/data';

/**
 * Use Calendar Range
 * @param timeRange
 * @param onChangeTimeRange
 */
export const useCalendarRange = (timeRange: TimeRange, onChangeTimeRange: (timeRange: AbsoluteTimeRange) => void) => {
  const [view, setView] = useState<'month' | 'week' | 'day'>(Views.MONTH);
  const [calendarFrom, setCalendarFrom] = useState(dayjs(timeRange.to.toDate()).startOf(view).toDate());
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
    (newDate: Date, currentView: View, action: NavigateAction) => {
      const view: View = action === 'DATE' ? 'day' : currentView;
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
          setView(view);

          return {
            from: newFrom.toDate(),
            to: newTo.toDate(),
          };
        }
        default: {
          return {
            from: newDate,
            to: newDate,
          };
        }
      }
    },
    [onChangeTimeRange, timeRange]
  );

  /**
   * Update calendar range if time range updated
   */
  useEffect(() => {
    setCalendarFrom(dayjs(timeRange.to.toDate()).startOf('month').toDate());
    setCalendarTo(timeRange.to.toDate());
  }, [timeRange.from, timeRange.to]);

  return {
    date: middleDate,
    view,
    onChangeView,
    onNavigate,
  };
};
