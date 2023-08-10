import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { AnnotationEvent, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { AnnotationsType } from '../constants';
import { CalendarEvent, CalendarOptions } from '../types';

/**
 * Get Annotations
 * @param timeRange
 */
const useAnnotations = (timeRange: TimeRange, options: CalendarOptions) => {
  const [annotations, setAnnotations] = useState<AnnotationEvent[]>([]);

  useEffect(() => {
    /**
     * Parameters
     */
    const params: { [name: string]: any } = { from: timeRange.from.valueOf(), to: timeRange.to.valueOf() };

    /**
     * Type
     */
    if (options.annotationsType === AnnotationsType.ALERT) {
      params.type = AnnotationsType.ALERT;
    } else if (options.annotationsType === AnnotationsType.ANNOTATION) {
      params.type = AnnotationsType.ANNOTATION;
    }

    /**
     * Max Limit
     */
    if (options.annotationsLimit) {
      params.limit = options.annotationsLimit;
    }

    getBackendSrv()
      .get<AnnotationEvent[] | null>('/api/annotations', params)
      .then((res) => setAnnotations(Array.isArray(res) ? res : []));
  }, [timeRange, options.annotationsLimit, options.annotationsType]);

  return annotations;
};

/**
 * Get Annotation events
 * @param timeRange
 * @param options
 */
export const useAnnotationEvents = (timeRange: TimeRange, options: CalendarOptions) => {
  const annotations = useAnnotations(timeRange, options);

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
