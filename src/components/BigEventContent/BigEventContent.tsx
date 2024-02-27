import { useStyles2 } from '@grafana/ui';
import React from 'react';
import { Event } from 'react-big-calendar';

import { DateLocalizer } from '../../types';
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

  /**
   * Localizer
   */
  localizer: DateLocalizer;
}

/**
 * Big Event Content
 */
export const BigEventContent: React.FC<Props> = ({ event, localizer }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  return (
    <>
      {!event.resource.allDay && (
        <div className={styles.date}>
          {localizer.format(event.start as Date, 'LT')}
          {!event.resource.noEndTime && ` – ${localizer.format(event.end as Date, 'LT')}`}
        </div>
      )}
      {event.title}
      {!!event.resource?.location && <span className={styles.location}>{`: ${event.resource.location}`}</span>}
    </>
  );
};
