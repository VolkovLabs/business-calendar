import { AnnotationEvent, DataFrame, PanelData, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { AnnotationsType, CalendarEvent, CalendarOptions, DashboardAnnotationEvent } from '../types';

/**
 * Get Api Annotations
 * @param timeRange
 * @param options
 */
const useApiAnnotations = (timeRange: TimeRange, options: CalendarOptions) => {
  const [annotations, setAnnotations] = useState<DashboardAnnotationEvent[]>([]);

  useEffect(() => {
    /**
     * Parameters
     */
    const params: Record<string, unknown> = { from: timeRange.from.valueOf(), to: timeRange.to.valueOf() };

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
 * Get Dashboard Annotations
 * @param timeRange
 * @param data
 */
const useDashboardAnnotations = (timeRange: TimeRange, dashboardAnnotations?: DataFrame[]) => {
  const [annotations, setAnnotations] = useState<DashboardAnnotationEvent[]>([]);

  useEffect(() => {
    if (!!dashboardAnnotations?.length) {
      /**
       * Get dashboard annotations
       */
      const annotations = dashboardAnnotations.flatMap((annotation) => {
        /**
         * Get necessary fields
         */
        const title = annotation.fields.find((field) => field.name === 'title');
        const tags = annotation.fields.find((field) => field.name === 'tags');
        const color = annotation.fields.find((field) => field.name === 'color');
        const time = annotation.fields.find((field) => field.name === 'time');
        const timeEnd = annotation.fields.find((field) => field.name === 'timeEnd');
        /**
         * Text use for description
         */
        const text = annotation.fields.find((field) => field.name === 'text');

        /**
         * Return annotations
         */
        return Array.from(Array(annotation.length)).map((event, index) => {
          return {
            text: title?.values[index] || '',
            tags: tags?.values[index] || [],
            color: color?.values[index] || '',
            time: time?.values[index] || undefined,
            description: text?.values[index] || '',
            timeEnd: timeEnd?.values[index] || undefined,
          };
        });
      });

      /**
       * Filter annotations by time range
       * Define start and end dates
       */
      const startDate = timeRange.from.valueOf();
      const endDate = timeRange.to.valueOf();

      const filteredAnnotations = annotations.filter((item) => {
        const itemDate = dayjs(item.time);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });

      setAnnotations(filteredAnnotations);
    }
  }, [dashboardAnnotations, timeRange]);

  return annotations;
};

/**
 * Get Annotation events
 * @param timeRange
 * @param options
 */
export const useAnnotationEvents = (timeRange: TimeRange, options: CalendarOptions, data: PanelData) => {
  const apiAnnotations = useApiAnnotations(timeRange, options);
  const dashboardAnnotations = useDashboardAnnotations(timeRange, data.annotations);

  return useMemo(() => {
    return [...apiAnnotations, ...dashboardAnnotations].map<CalendarEvent>((annotation) => ({
      text: annotation.text ?? '',
      start: dayjs(annotation.time),
      end: annotation.timeEnd ? dayjs(annotation.timeEnd) : undefined,
      open: false,
      labels: annotation.tags || [],
      description: annotation.description ?? '',
      color: annotation.color || '',
    }));
  }, [apiAnnotations, dashboardAnnotations]);
};
