import { act, renderHook } from '@testing-library/react';

import { useTimeRange } from './useTimeRange';

/**
 * Mock variable for getVariable
 */
const mockedVariable = { includeAll: false, current: { value: '2022-04-10' } };

/**
 * Mock hooks
 */
jest.mock('./useRuntimeVariables', () => ({
  ...jest.requireActual('./useRuntimeVariables'),
  useRuntimeVariables: jest.fn(() => {
    return {
      getVariable: jest.fn(() => {
        return mockedVariable;
      }),
    };
  }),
}));

describe('useTimeRange', () => {
  const defaultTimeRange = { from: '2022-01-01', to: '2022-01-07' } as any;
  const defultOnChangeTimeRange = jest.fn();
  const baseOptions = { timeRangeType: 'default' } as any;
  const eventBus = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the time range with the provided default value', () => {
    const { result } = renderHook(() =>
      useTimeRange({
        defaultTimeRange,
        defaultOnChangeTimeRange: defultOnChangeTimeRange,
        options: baseOptions,
        eventBus,
      })
    );

    expect(result.current.timeRange).toEqual(defaultTimeRange);
  });

  it('should update the time range when options.timeRangeType is MANUAL', () => {
    const options = {
      ...baseOptions,
      timeRangeType: 'manual',
      startTimeRange: '2022-02-10',
      endTimeRange: '2022-06-15',
      startTimeVariable: 'start',
      endTimeVariable: 'end',
    } as any;

    const { result } = renderHook(() =>
      useTimeRange({ defaultTimeRange, defaultOnChangeTimeRange: defultOnChangeTimeRange, options, eventBus })
    );

    expect(result.current.timeRange.from.toISOString()).toEqual('2022-02-10T00:00:00.000Z');
    expect(result.current.timeRange.to.toISOString()).toEqual('2022-06-15T00:00:00.000Z');
  });

  it('should update the time range when options.timeRangeType is VARIABLE', () => {
    const startTimeVariable = 'start';
    const endTimeVariable = 'end';
    const options = { ...baseOptions, timeRangeType: 'variable', startTimeVariable, endTimeVariable };

    const { result } = renderHook(() =>
      useTimeRange({ defaultTimeRange, defaultOnChangeTimeRange: defultOnChangeTimeRange, options, eventBus })
    );

    expect(result.current.timeRange.from.toISOString()).toEqual('2022-04-10T00:00:00.000Z');
  });

  it('should call defaultOnChangeTimeRange when options.timeRangeType is DEFAULT', () => {
    const { result } = renderHook(() =>
      useTimeRange({
        defaultTimeRange,
        defaultOnChangeTimeRange: defultOnChangeTimeRange,
        options: baseOptions,
        eventBus,
      })
    );

    const newTimeRange = { from: '2022-01-10', to: '2022-01-15' } as any;

    act(() => {
      result.current.onChangeTimeRange(newTimeRange);
    });

    expect(defultOnChangeTimeRange).toHaveBeenCalledWith(newTimeRange);
  });
});
