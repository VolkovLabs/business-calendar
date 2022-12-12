import { useEffect, useState } from 'react';
import { AnnotationEvent, TimeRange } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

/**
 * Get Annotations
 */
export const useAnnotations = (timeRange: TimeRange) => {
  const [annotations, setAnnotations] = useState<AnnotationEvent[]>([]);

  useEffect(() => {
    getBackendSrv()
      .get('/api/annotations', { from: timeRange.from.valueOf(), to: timeRange.to.valueOf() })
      .then((res) => setAnnotations(res));
  }, [timeRange]);

  return annotations;
};
