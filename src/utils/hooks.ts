import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { AnnotationEvent } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

type Range = [dayjs.Dayjs, dayjs.Dayjs];

/**
 * Key Press
 */
export const useKeyPress = (key: string, onKeyPressed: (pressed: boolean) => void) => {
  const keydownListener = useCallback(
    (e: any) => {
      if (e.key === 'Shift') {
        onKeyPressed(true);
      }
    },
    [onKeyPressed]
  );

  const keyupListener = useCallback(
    (e: any) => {
      if (e.key === 'Shift') {
        onKeyPressed(false);
      }
    },
    [onKeyPressed]
  );

  useEffect(() => {
    window.addEventListener('keydown', keydownListener, true);
    return () => window.removeEventListener('keydown', keydownListener, true);
  }, [keydownListener]);

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

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<AnnotationEvent[]>([]);

  useEffect(() => {
    getAnnotations().then((res) => setAnnotations(res));
  }, []);

  return annotations;
};

const getAnnotations = async (): Promise<AnnotationEvent[]> => {
  return getBackendSrv().get('/api/annotations', {});
};
