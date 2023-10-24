import React from 'react';
import { dateTime, TimeRange } from '@grafana/data';
import { act, render, renderHook, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { View } from '../types';
import { getUnitType, useCalendarRange } from './useCalendarRange';

/**
 * Use Calendar Range
 */
describe('Use Calendar Range', () => {
  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Default time range
   */
  const defaultTimeRange: TimeRange = {
    from: dateTime(getSafeDate()),
    to: dateTime(getSafeDate()),
    raw: {
      from: dateTime(getSafeDate()),
      to: dateTime(getSafeDate()),
    },
  };

  const onChangeTimeRange = jest.fn();

  beforeEach(() => {
    onChangeTimeRange.mockClear();
  });

  it('Should set last month for initial date if month by default', () => {
    const last3Months = dayjs(getSafeDate()).subtract(3, 'month');
    const timeRange = {
      ...defaultTimeRange,
      from: dateTime(last3Months.toDate()),
    };
    const { result } = renderHook(() => useCalendarRange(timeRange, onChangeTimeRange, View.MONTH));

    expect(result.current.date.toISOString()).toEqual(new Date('2023-02-01 12:00').toISOString());
  });

  it('Should set last week for initial date if week by default', () => {
    const last3Months = dayjs(getSafeDate()).subtract(3, 'month');
    const timeRange = {
      ...defaultTimeRange,
      from: dateTime(last3Months.toDate()),
    };
    const { result } = renderHook(() => useCalendarRange(timeRange, onChangeTimeRange, View.WEEK));

    expect(result.current.date.toISOString()).toEqual(new Date('2023-01-31 00:00').toISOString());
  });

  it('Should set last day for initial date if day by default', () => {
    const last3Months = dayjs(getSafeDate()).subtract(3, 'month');
    const timeRange = {
      ...defaultTimeRange,
      from: dateTime(last3Months.toDate()),
    };
    const { result } = renderHook(() => useCalendarRange(timeRange, onChangeTimeRange, View.DAY));

    expect(result.current.date.toISOString()).toEqual(new Date('2023-02-02 00:00').toISOString());
  });

  it('Should update calendar dates on time range update', () => {
    const last3Months = dayjs(getSafeDate()).subtract(3, 'month');
    const timeRange = {
      ...defaultTimeRange,
      from: dateTime(last3Months.toDate()),
    };

    /**
     * Component to test re-render
     * @param timeRange
     * @constructor
     */
    const Component = ({ timeRange }: any) => {
      const { date } = useCalendarRange(timeRange, onChangeTimeRange, View.DAY);
      return <div data-testid="date">{date.toISOString()}</div>;
    };

    const { rerender } = render(<Component timeRange={timeRange} />);

    expect(screen.getByTestId('date')).toHaveTextContent('2023-02-02T00:00:00.000Z');

    /**
     * Re-render with updated timeRange
     */
    rerender(<Component timeRange={{ ...timeRange, from: dateTime(last3Months.subtract(1, 'month').toDate()) }} />);

    expect(screen.getByTestId('date')).toHaveTextContent('2022-12-02T12:00:00.000Z');
  });

  describe('Navigate', () => {
    it('Should apply new range based on view', async () => {
      const last3Months = dayjs(getSafeDate()).subtract(3, 'month');
      const timeRange = {
        ...defaultTimeRange,
        from: dateTime(last3Months.toDate()),
      };
      const { result } = renderHook(() => useCalendarRange(timeRange, onChangeTimeRange, View.MONTH));

      /**
       * Month
       */
      await act(async () => {
        const toDate = dayjs(timeRange.to.toDate()).subtract(1, 'month').toDate();
        const newTimeRange = result.current.onNavigate(toDate, View.MONTH, 'PREV');
        expect(newTimeRange.from.toISOString()).toEqual(dayjs(toDate).startOf('month').toISOString());
        expect(newTimeRange.to.toISOString()).toEqual(dayjs(toDate).endOf('month').toISOString());
      });

      /**
       * Week
       */
      await act(async () => {
        const toDate = dayjs(timeRange.to.toDate()).subtract(1, 'week').toDate();
        const newTimeRange = result.current.onNavigate(toDate, View.WEEK, 'PREV');
        expect(newTimeRange.from.toISOString()).toEqual(dayjs(toDate).startOf('week').toISOString());
        expect(newTimeRange.to.toISOString()).toEqual(dayjs(toDate).endOf('week').toISOString());
      });

      /**
       * Day
       */
      await act(async () => {
        const toDate = dayjs(timeRange.to.toDate()).subtract(1, 'day').toDate();
        const newTimeRange = result.current.onNavigate(toDate, View.DAY, 'PREV');
        expect(newTimeRange.from.toISOString()).toEqual(dayjs(toDate).startOf('day').toISOString());
        expect(newTimeRange.to.toISOString()).toEqual(dayjs(toDate).endOf('day').toISOString());
      });
    });

    it('Should replace time range if newStart is out of range', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const previousMonth = dayjs(getSafeDate()).subtract(1, 'month');

      await act(() => result.current.onNavigate(previousMonth.toDate(), View.MONTH, 'PREV'));

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: previousMonth.startOf('month').valueOf(),
        to: previousMonth.endOf('month').valueOf(),
      });
    });

    it('Should replace time range if newEnd is out of range', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const nextMonth = dayjs(getSafeDate()).add(1, 'month');

      await act(() => result.current.onNavigate(nextMonth.toDate(), View.MONTH, 'PREV'));

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: nextMonth.startOf('month').valueOf(),
        to: nextMonth.endOf('month').valueOf(),
      });
    });

    it('Should use day view if action is date', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const nextMonth = dayjs(getSafeDate()).add(1, 'month');

      await act(() => result.current.onNavigate(nextMonth.toDate(), View.MONTH, 'DATE'));

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: nextMonth.startOf('day').valueOf(),
        to: nextMonth.endOf('day').valueOf(),
      });
    });

    it('Should use week view if action is date from year view', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const nextMonth = dayjs(getSafeDate()).add(1, 'month');

      await act(() => result.current.onNavigate(nextMonth.toDate(), View.YEAR, 'DATE'));

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: nextMonth.startOf('week').valueOf(),
        to: nextMonth.endOf('week').valueOf(),
      });
    });
  });

  describe('Change View', () => {
    it('Should update view', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      expect(result.current.view).toEqual('month');

      await act(async () => result.current.onChangeView(View.DAY));

      expect(result.current.view).toEqual('day');
    });

    it('Should set date according to view', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const runChangeViewTest = async (view: View) => {
        const previousDate = new Date(result.current.date.valueOf());

        await act(async () => result.current.onChangeView(view));

        const firstDayInPeriod = dayjs(previousDate).startOf(getUnitType(view));
        const lastDayInPeriod = dayjs(previousDate).endOf(getUnitType(view));
        const expectedDate = new Date((firstDayInPeriod.valueOf() + lastDayInPeriod.valueOf()) / 2);

        expect(result.current.date.toISOString()).toEqual(expectedDate.toISOString());
      };

      await runChangeViewTest(View.YEAR);
      await runChangeViewTest(View.WEEK);
      await runChangeViewTest(View.DAY);
      await runChangeViewTest(View.MONTH);
      await runChangeViewTest(View.WORK_WEEK);
    });

    it('Should update time range if start is out of range', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      await act(async () => result.current.onChangeView(View.WEEK));

      const middleDate = new Date('2023-02-01');

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: dayjs(middleDate).startOf('week').valueOf(),
        to: dayjs(middleDate).endOf('week').valueOf(),
      });
    });

    it('Should replace time range if end is out of range', async () => {
      const timeRange = {
        ...defaultTimeRange,
        from: dateTime(dayjs(getSafeDate()).subtract(1, 'month').toDate()),
        to: dateTime(dayjs(getSafeDate()).toDate()),
      };
      const { result } = renderHook(() => useCalendarRange(timeRange, onChangeTimeRange));

      await act(async () => result.current.onChangeView(View.DAY));

      onChangeTimeRange.mockClear();

      await act(async () => result.current.onChangeView(View.WEEK));

      const middleDate = new Date('2023-02-01');
      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: dayjs(middleDate).startOf('week').valueOf(),
        to: dayjs(middleDate).endOf('week').valueOf(),
      });
    });
  });
});
