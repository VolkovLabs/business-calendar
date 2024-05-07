import { AbsoluteTimeRange, EventBus, rangeUtil, TimeRange } from '@grafana/data';
import { useCallback, useEffect, useState } from 'react';
import { CalendarOptions, TimeRangeType } from 'types';
import { getVariableValue } from 'utils';

import { useRuntimeVariables } from './useRuntimeVariables';

/**
 * Use Time Range
 */
export const useTimeRange = ({
  defaultTimeRange,
  defultOnChangeTimeRange,
  options,
  eventBus,
}: {
  defaultTimeRange: TimeRange;
  defultOnChangeTimeRange: (timeRange: AbsoluteTimeRange) => void;
  options: CalendarOptions;
  eventBus: EventBus;
}) => {
  /**
   * Runtime Variables
   */
  const { getVariable } = useRuntimeVariables(eventBus, '');
  const startTimeVariable = getVariable(options?.startTimeVariable || '');
  const endTimeVariable = getVariable(options?.endTimeVariable || '');

  const [timeRange, setTimeRange] = useState(defaultTimeRange);

  useEffect(() => {
    if (options.timeRangeType === TimeRangeType.MANUAL && options.endTimeRange && options.startTimeRange) {
      /**
       * Set Time Range for manual type
       */
      const manualTimeRange = rangeUtil.convertRawToRange({
        from: options.startTimeRange,
        to: options.endTimeRange,
      });

      setTimeRange(manualTimeRange);
      return;
    }
    if (options.timeRangeType === TimeRangeType.VARIABLE && startTimeVariable && endTimeVariable) {
      /**
       * Set Time Range for variable type
       */
      const manualTimeRange = rangeUtil.convertRawToRange({
        from: getVariableValue(startTimeVariable),
        to: getVariableValue(endTimeVariable),
      });

      /**
       * Set Time Range by default
       */
      setTimeRange(manualTimeRange);
      return;
    }
    setTimeRange(defaultTimeRange);
  }, [
    defaultTimeRange,
    endTimeVariable,
    options.endTimeRange,
    options.startTimeRange,
    options.timeRangeType,
    startTimeVariable,
  ]);

  const onChangeTimeRange = useCallback(
    (timeRange: AbsoluteTimeRange) => {
      /**
       * Change time range only for default
       */
      if (options.timeRangeType === TimeRangeType.DEFAULT) {
        defultOnChangeTimeRange(timeRange);
      }
    },
    [defultOnChangeTimeRange, options.timeRangeType]
  );

  return {
    timeRange: timeRange,
    onChangeTimeRange: onChangeTimeRange,
  };
};
