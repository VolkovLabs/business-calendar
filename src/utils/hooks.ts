import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Range } from '../types';

/**
 * Key Press
 */
export const useKeyPress = (key: string, onKeyPressed: (pressed: boolean) => void) => {
  /**
   * Key down
   */
  const keydownListener = useCallback(
    (e: any) => {
      if (e.key === 'Shift') {
        onKeyPressed(true);
      }
    },
    [onKeyPressed]
  );

  /**
   * Key up
   */
  const keyupListener = useCallback(
    (e: any) => {
      if (e.key === 'Shift') {
        onKeyPressed(false);
      }
    },
    [onKeyPressed]
  );

  /**
   * Event for Key down
   */
  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener]);

  /**
   * Event for Key up
   */
  useEffect(() => {
    window.addEventListener('keyup', keyupListener, true);
    return () => window.removeEventListener('keyup', keyupListener, true);
  }, [keyupListener]);
};

/**
 * Interval Selection
 */
export const useIntervalSelection = (): [Range | undefined, () => void, (time: dayjs.Dayjs) => void] => {
  const [selectedInterval, setSelectedInterval] = useState<Range>();
  const [intervalSelection, setIntervalSelection] = useState(false);

  useKeyPress('Shift', (pressed) => {
    setIntervalSelection(pressed);
  });

  const onTimeSelection = useCallback(
    (time: dayjs.Dayjs) => {
      if (!selectedInterval && !intervalSelection) {
        setSelectedInterval([time.startOf('day'), time.endOf('day')]);
        return;
      }

      if (selectedInterval && intervalSelection) {
        const [start, end] = selectedInterval;

        if (time.isSame(start)) {
          setSelectedInterval(undefined);
        }
        if (time.isBefore(end)) {
          setSelectedInterval([time, end]);
        }
        if (start.isBefore(time)) {
          setSelectedInterval([start, time.endOf('day')]);
        }

        return;
      }

      if (selectedInterval) {
        const clone1 = time.startOf('day');
        const clone2 = time.endOf('day');

        if (clone1.isSame(selectedInterval[0])) {
          setSelectedInterval(undefined);
          return;
        }

        setSelectedInterval([clone1, clone2]);
      }
    },
    [selectedInterval, intervalSelection]
  );

  const clear = () => {
    setSelectedInterval(undefined);
  };

  return [selectedInterval, clear, onTimeSelection];
};
