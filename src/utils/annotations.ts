import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { AnnotationEvent, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { CalendarEvent } from '../types';

/**
 * Get Annotations
 * @param timeRange
 */
const useAnnotations = (timeRange: TimeRange) => {
  const [annotations, setAnnotations] = useState<AnnotationEvent[]>([]);

  useEffect(() => {
    getBackendSrv()
      .get<AnnotationEvent[] | null>('/api/annotations', { from: timeRange.from.valueOf(), to: timeRange.to.valueOf() })
      .then((res) => setAnnotations(Array.isArray(res) ? res : []));
  }, [timeRange]);

  return annotations;
};

/**
 * Get Annotation events
 * @param timeRange
 */
export const useAnnotationEvents = (timeRange: TimeRange) => {
  const annotations = useAnnotations(timeRange);

  return useMemo(() => {
    return annotations.map<CalendarEvent>((annotation) => ({
      text: annotation.text ?? '',
      start: dayjs(annotation.time),
      end: annotation.timeEnd ? dayjs(annotation.timeEnd) : undefined,
      open: false,
      labels: annotation.tags || [],
      color: annotation.color || '',
    }));
  }, [annotations]);
};
