import { useStyles2 } from '@grafana/ui';
import React from 'react';
import { Event } from 'react-big-calendar';

import { getStyles } from './BigEventContent.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Event
   *
   * @type {Event}
   */
  event: Event;
}

/**
 * Big Event Content
 */
export const BigEventContent: React.FC<Props> = ({ event }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  return (
    <>
      {event.title}
      {!!event.resource?.location && <span className={styles.location}>{`: ${event.resource.location}`}</span>}
    </>
  );
};
