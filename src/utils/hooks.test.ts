import { act, fireEvent, renderHook } from '@testing-library/react';
import days from 'dayjs';

import { useIntervalSelection } from './hooks';

/**
 * Hooks
 */
describe('Hooks', () => {
  it('Should set interval', () => {
    const { result } = renderHook(() => useIntervalSelection());
    const [, , onTimeSelection] = result.current;

    const day = days(new Date('2023-02-02'));
    act(() => onTimeSelection(day));

    const selectedInterval = result.current[0] || [];
    const from = selectedInterval[0];
    const to = selectedInterval[1];
    expect(from?.isSame(day.startOf('day'))).toBeTruthy();
    expect(to?.isSame(day.endOf('day'))).toBeTruthy();
  });

  it('Should reset interval', () => {
    const { result, rerender } = renderHook(() => useIntervalSelection());

    const day = days(new Date('2023-02-02'));
    act(() => result.current[2](day));
    rerender();
    act(() => result.current[2](day));

    const selectedInterval = result.current[0];
    expect(selectedInterval).toEqual(undefined);
  });

  it('Should update interval', () => {
    const { result, rerender } = renderHook(() => useIntervalSelection());

    const day = days(new Date('2023-02-02'));
    act(() => result.current[2](day));

    rerender();

    const newDay = days(new Date('2023-02-03'));
    act(() => result.current[2](newDay));

    const selectedInterval = result.current[0] || [];
    const from = selectedInterval[0];
    const to = selectedInterval[1];
    expect(from?.isSame(newDay.startOf('day'))).toBeTruthy();
    expect(to?.isSame(newDay.endOf('day'))).toBeTruthy();
  });

  it('Should clean interval', () => {
    const { result } = renderHook(() => useIntervalSelection());
    const [, , onTimeSelection] = result.current;

    const day = days(new Date('2023-02-02'));
    act(() => onTimeSelection(day));

    const selectedInterval = result.current[0] || [];
    const from = selectedInterval[0];
    const to = selectedInterval[1];

    expect(from?.isSame(day.startOf('day'))).toBeTruthy();
    expect(to?.isSame(day.endOf('day'))).toBeTruthy();

    act(() => result.current[1]());

    expect(result.current[0]).toEqual(undefined);
  });

  it('Should update start interval if intervalSelection active', () => {
    const { result, rerender } = renderHook(() => useIntervalSelection());

    const day = days(new Date('2023-02-02'));
    act(() => result.current[2](day));

    rerender();

    fireEvent.keyDown(window, { key: 'Shift' });

    const newDay = day.subtract(1, 'days');
    act(() => result.current[2](newDay));

    const selectedInterval = result.current[0] || [];
    const from = selectedInterval[0];
    const to = selectedInterval[1];
    expect(from?.isSame(newDay.startOf('day'))).toBeTruthy();
    expect(to?.isSame(day.endOf('day'))).toBeTruthy();
  });

  it('Should update end interval if intervalSelection active', () => {
    const { result, rerender } = renderHook(() => useIntervalSelection());

    const day = days(new Date('2023-02-02'));
    act(() => result.current[2](day));

    rerender();

    fireEvent.keyDown(window, { key: 'Shift' });

    const newDay = day.add(1, 'days');
    act(() => result.current[2](newDay));

    const selectedInterval = result.current[0] || [];
    const from = selectedInterval[0];
    const to = selectedInterval[1];
    expect(from?.isSame(day.startOf('day'))).toBeTruthy();
    expect(to?.isSame(newDay.endOf('day'))).toBeTruthy();
  });

  it('Should reset interval if intervalSelection active and time is the same', () => {
    const { result, rerender } = renderHook(() => useIntervalSelection());

    const day = days(new Date('2023-02-02'));
    act(() => result.current[2](day));

    rerender();

    fireEvent.keyDown(window, { key: 'Shift' });

    const newDay = day;
    act(() => result.current[2](newDay));

    const selectedInterval = result.current[0] || [];
    const from = selectedInterval[0];
    const to = selectedInterval[1];
    expect(from?.isSame(day.startOf('day'))).toBeTruthy();
    expect(to?.isSame(newDay.endOf('day'))).toBeTruthy();
  });

  it('Should disable intervalSelection on key up', () => {
    const { result, rerender } = renderHook(() => useIntervalSelection());

    const day = days(new Date('2023-02-02'));
    act(() => result.current[2](day));

    rerender();

    fireEvent.keyDown(window, { key: 'Shift' });
    fireEvent.keyUp(window, { key: 'Shift' });

    const newDay = day.add(1, 'days');
    act(() => result.current[2](newDay));

    const selectedInterval = result.current[0] || [];
    const from = selectedInterval[0];
    const to = selectedInterval[1];
    expect(from?.isSame(newDay.startOf('day'))).toBeTruthy();
    expect(to?.isSame(newDay.endOf('day'))).toBeTruthy();
  });
});
