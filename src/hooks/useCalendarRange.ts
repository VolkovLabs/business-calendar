import { AbsoluteTimeRange, TimeRange } from '@grafana/data';
import dayjs, { OpUnitType } from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, NavigateAction } from 'react-big-calendar';

import { View } from '../types';

/**
 * Get Unit Type
 */
export const getUnitType = (view: View): OpUnitType => {
  switch (view) {
    case View.WORK_WEEK: {
      return 'week';
    }
    case View.AGENDA: {
      return 'month';
    }
  }
  return view;
};

/**
 * Use Calendar Range
 * @param timeRange
 * @param onChangeTimeRange
 * @param defaultView
 */
export const useCalendarRange = (
  timeRange: TimeRange,
  onChangeTimeRange: (timeRange: AbsoluteTimeRange) => void,
  defaultView = View.MONTH
) => {
  const [view, setView] = useState(defaultView);
  const previousTimeRange = useRef(timeRange);
  const [calendarFrom, setCalendarFrom] = useState(dayjs(timeRange.to.toDate()).startOf(getUnitType(view)).toDate());
  const [calendarTo, setCalendarTo] = useState(timeRange.to.toDate());
  const isExternalUpdate = useRef<boolean>(false);

  /**
   * Middle date within the range to show current date in Calendar
   */
  const middleDate = useMemo((): Date => {
    /**
     * Return start of period date for agenda due to different calculation
     * From: date
     * To: date + days count
     */
    if (view === View.AGENDA) {
      return dayjs(calendarTo).startOf('month').toDate();
    }

    return new Date((calendarFrom.valueOf() + calendarTo.valueOf()) / 2);
  }, [calendarFrom, calendarTo, view]);

  /**
   * Change Calendar View
   */
  const onChangeView = useCallback(
    (newView: View) => {
      const unitType = getUnitType(newView);
      const { from, to } = timeRange;
      const newFrom = dayjs(middleDate).startOf(unitType);
      const newTo = dayjs(middleDate).endOf(unitType);

      /**
       * Change time range if one of dates are out of the current range
       */
      if (newFrom.valueOf() < from.valueOf() || newTo.valueOf() > to.valueOf()) {
        onChangeTimeRange({
          from: newFrom.valueOf(),
          to: newTo.valueOf(),
        });
      }

      isExternalUpdate.current = true;
      setCalendarFrom(newFrom.toDate());
      setCalendarTo(newTo.toDate());
      setView(newView);
    },
    [onChangeTimeRange, middleDate, timeRange]
  );

  /**
   * Change Calendar Time Range
   */
  const onNavigate = useCallback(
    (newDate: Date, currentView: View, action: NavigateAction) => {
      let view: View = action === Navigate.DATE ? View.DAY : currentView;

      /**
       * Prevent incorrect navigation for Agenda view
       * Add 1 extra day
       */
      const newCurrentDate = view === View.AGENDA ? dayjs(newDate).add(1, 'day').toDate() : newDate;

      /**
       * Open Week by clicking on day in Year View
       */
      if (currentView === View.YEAR && action === Navigate.DATE) {
        view = View.WEEK;
      }

      const unitType = getUnitType(view);
      const { from, to } = timeRange;
      const newFrom = dayjs(newCurrentDate).startOf(unitType);
      const newTo = dayjs(newCurrentDate).endOf(unitType);

      /**
       * Change time range if one of dates are out of the current range
       */
      if (newFrom.valueOf() < from.valueOf() || newTo.valueOf() > to.valueOf()) {
        onChangeTimeRange({
          from: newFrom.valueOf(),
          to: newTo.valueOf(),
        });
      }

      isExternalUpdate.current = false;
      setCalendarFrom(newFrom.toDate());
      setCalendarTo(newTo.toDate());
      setView(view);

      return {
        from: newFrom.toDate(),
        to: newTo.toDate(),
      };
    },
    [onChangeTimeRange, timeRange]
  );

  /**
   * Update calendar range if time range updated
   */
  useEffect(() => {
    if (isExternalUpdate.current && previousTimeRange.current !== timeRange) {
      setCalendarFrom(timeRange.from.toDate());
      setCalendarTo(timeRange.to.toDate());
      previousTimeRange.current = timeRange;
    } else {
      isExternalUpdate.current = true;
    }
  }, [timeRange, timeRange.from, timeRange.to]);

  return {
    date: middleDate,
    view,
    onChangeView,
    onNavigate,
  };
};
