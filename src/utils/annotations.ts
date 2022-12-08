import { useEffect, useState } from 'react';
import { AnnotationEvent } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<AnnotationEvent[]>([]);

  useEffect(() => {
    getAnnotations().then((res) => setAnnotations(res));
  }, []);

  return annotations;
};

/**
 * Get Annotations
 */
const getAnnotations = async (): Promise<AnnotationEvent[]> => {
  return getBackendSrv().get('/api/annotations', {});
};
