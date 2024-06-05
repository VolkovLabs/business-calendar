import { AnnotationEvent, DataFrame, PanelData, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { AnnotationsType, CalendarEvent, CalendarOptions, DashboardAnnotation } from '../types';

/**
 * Get Api Annotations
 * @param timeRange
 * @param options
 */
const useApiAnnotations = (timeRange: TimeRange, options: CalendarOptions) => {
  const [annotations, setAnnotations] = useState<AnnotationEvent[]>([]);

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
  const [annotations, setAnnotations] = useState<AnnotationEvent[]>([]);

  useEffect(() => {
    if (!!dashboardAnnotations?.length) {
      /**
       * Get dashboard annotations
       */
      const annotations = dashboardAnnotations.flatMap((annotation) => {
        /**
         * Create annotation object based on fields
         */
        const annotationObject = annotation.fields.reduce((acc, curr) => {
          acc[curr.name] = curr.values;
          return acc;
        }, {} as DashboardAnnotation);

        /**
         * Return annotations
         */
        return Array.from(Array(annotation.length)).map((event, index) => {
          return {
            text: annotationObject.title?.[index] ?? '',
            tags: annotationObject.tags?.[index] ?? [],
            color: annotationObject.color?.[index] ?? '',
            time: annotationObject.time?.[index] ?? undefined,
            timeEnd: annotationObject.timeEnd?.[index] ?? undefined,
            id: annotationObject.id?.[index] ?? '',
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
      color: annotation.color || '',
    }));
  }, [apiAnnotations, dashboardAnnotations]);
};
