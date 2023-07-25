import dayjs from 'dayjs';
import { dateTime, TimeRange } from '@grafana/data';
import { act, renderHook } from '@testing-library/react';
import { useCalendarRange } from './useCalendarRange';

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

  it('Should set last month for initial date', () => {
    const last3Months = dayjs(getSafeDate()).subtract(3, 'month');
    const timeRange = {
      ...defaultTimeRange,
      from: dateTime(last3Months.toDate()),
    };
    const { result } = renderHook(() => useCalendarRange(timeRange, onChangeTimeRange));

    expect(result.current.date.toISOString()).toEqual(new Date('2023-02-01 12:00').toISOString());
  });

  describe('Navigate', () => {
    it('Should apply new range based on view', async () => {
      const last3Months = dayjs(getSafeDate()).subtract(3, 'month');
      const timeRange = {
        ...defaultTimeRange,
        from: dateTime(last3Months.toDate()),
      };
      const { result } = renderHook(() => useCalendarRange(timeRange, onChangeTimeRange));

      /**
       * Month
       */
      await act(() => {
        const toDate = timeRange.to.subtract(1, 'month').toDate();
        const newTimeRange = result.current.onNavigate(toDate, 'month', 'PREV');
        expect(newTimeRange.from.toISOString()).toEqual(dayjs(toDate).startOf('month').toISOString());
        expect(newTimeRange.to.toISOString()).toEqual(dayjs(toDate).endOf('month').toISOString());
      });

      /**
       * Week
       */
      await act(() => {
        const toDate = timeRange.to.subtract(1, 'week').toDate();
        const newTimeRange = result.current.onNavigate(toDate, 'week', 'PREV');
        expect(newTimeRange.from.toISOString()).toEqual(dayjs(toDate).startOf('week').toISOString());
        expect(newTimeRange.to.toISOString()).toEqual(dayjs(toDate).endOf('week').toISOString());
      });

      /**
       * Day
       */
      await act(() => {
        const toDate = timeRange.to.subtract(1, 'day').toDate();
        const newTimeRange = result.current.onNavigate(toDate, 'day', 'PREV');
        expect(newTimeRange.from.toISOString()).toEqual(dayjs(toDate).startOf('day').toISOString());
        expect(newTimeRange.to.toISOString()).toEqual(dayjs(toDate).endOf('day').toISOString());
      });
    });

    it('Should replace time range if newStart is out of range', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const previousMonth = dayjs(getSafeDate()).subtract(1, 'month');

      await act(() => result.current.onNavigate(previousMonth.toDate(), 'month', 'PREV'));

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: previousMonth.startOf('month').valueOf(),
        to: previousMonth.endOf('month').valueOf(),
      });
    });

    it('Should replace time range if newEnd is out of range', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const nextMonth = dayjs(getSafeDate()).add(1, 'month');

      await act(() => result.current.onNavigate(nextMonth.toDate(), 'month', 'PREV'));

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: nextMonth.startOf('month').valueOf(),
        to: nextMonth.endOf('month').valueOf(),
      });
    });

    it('Should use day view if action is date', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const nextMonth = dayjs(getSafeDate()).add(1, 'month');

      await act(() => result.current.onNavigate(nextMonth.toDate(), 'month', 'DATE'));

      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: nextMonth.startOf('day').valueOf(),
        to: nextMonth.endOf('day').valueOf(),
      });
    });
  });

  describe('Change View', () => {
    it('Should update view', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      expect(result.current.view).toEqual('month');

      await act(() => result.current.onChangeView('day'));

      expect(result.current.view).toEqual('day');
    });

    it('Should set date according to view', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      const runChangeViewTest = async (view: 'month' | 'week' | 'day') => {
        const previousDate = new Date(result.current.date.valueOf());

        await act(() => result.current.onChangeView(view));

        const firstDayInPeriod = dayjs(previousDate).startOf(view);
        const lastDayInPeriod = dayjs(previousDate).endOf(view);
        const expectedDate = new Date((firstDayInPeriod.valueOf() + lastDayInPeriod.valueOf()) / 2);

        expect(result.current.date.toISOString()).toEqual(expectedDate.toISOString());
      };

      await runChangeViewTest('week');
      await runChangeViewTest('day');
      await runChangeViewTest('month');
    });

    it('Should update time range if start is out of range', async () => {
      const { result } = renderHook(() => useCalendarRange(defaultTimeRange, onChangeTimeRange));

      await act(() => result.current.onChangeView('week'));

      const middleDate = new Date('2022-12-13');
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

      await act(() => result.current.onChangeView('day'));

      onChangeTimeRange.mockClear();

      await act(() => result.current.onChangeView('week'));

      const middleDate = new Date('2023-02-01');
      expect(onChangeTimeRange).toHaveBeenCalledWith({
        from: dayjs(middleDate).startOf('week').valueOf(),
        to: dayjs(middleDate).endOf('week').valueOf(),
      });
    });
  });
});
