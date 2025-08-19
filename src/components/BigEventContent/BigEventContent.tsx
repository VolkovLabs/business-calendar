import { Tooltip, useStyles2 } from '@grafana/ui';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { Event } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { CalendarOptions, DateLocalizer } from '../../types';
import { returnCalendarEvent } from '../../utils';
import { EventDetails } from '../EventDetails';
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
   *
   * @type {DateLocalizer}
   */
  localizer: DateLocalizer;

  /**
   * is Month
   *
   * @type {boolean}
   */
  isMonth?: boolean;

  /**
   * is Agenda
   *
   * @type {boolean}
   */
  isAgenda?: boolean;

  /**
   * Text Size
   *
   * @type {number}
   */
  textSize?: number;

  /**
   * Options
   *
   * @type {CalendarOptions}
   */
  options: CalendarOptions;
}

/**
 * Big Event Content
 */
export const BigEventContent: React.FC<Props> = ({ event, localizer, isMonth = false, isAgenda = false, options }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles, options.textSize);

  /**
   * Active Event
   */
  const activeEvent = useMemo(() => returnCalendarEvent(event), [event]);

  /**
   * Return Content Element
   */
  const eventContentElement = useMemo(() => {
    /**
     * Return view for Month
     */
    if (isMonth) {
      return (
        <div data-testid={TEST_IDS.eventContent.month} className={styles.date}>
          {!event.resource.allDay && options.showMonthTime && localizer.format(event.start as Date, 'LT')}
          <span className={styles.text}>{event.title}</span>
        </div>
      );
    }

    /**
     * Return view for Agenda
     */
    if (isAgenda) {
      return (
        <div data-testid={TEST_IDS.eventContent.agenda} className={styles.agenda}>
          <span className={styles.text}>{event.title}</span>
          {!!event.resource?.location && <span className={styles.location}>{event.resource.location}</span>}
        </div>
      );
    }

    /**
     * Calculate duration time
     */
    const durationInMinutes = event.resource.noEndTime ? 0 : dayjs(event.end).diff(dayjs(event.start), 'minutes');

    /**
     * Return view for duration In Minutes more or equal 90 minutes
     */
    if (durationInMinutes >= 90) {
      return (
        <div data-testid={TEST_IDS.eventContent.longDuration} className={styles.date}>
          <span className={styles.title}>{event.title}</span>
          <div className={styles.info}>
            {!event.resource.allDay &&
              `${localizer.format(event.start as Date, 'LT')} – ${localizer.format(event.end as Date, 'LT')}`}
            {!event.resource.allDay && !!event.resource?.location && <span>{`${event.resource.location}`}</span>}
          </div>
        </div>
      );
    }

    /**
     * Return view for duration In Minutes more or equal 45 minutes
     */
    if (durationInMinutes >= 45) {
      return (
        <div data-testid={TEST_IDS.eventContent.averageDuration} className={styles.date}>
          <span className={styles.title}>{event.title}</span>
          <div>
            {localizer.format(event.start as Date, 'LT')}
            {!!event.resource?.location && <span className={styles.location}>{`${event.resource.location}`}</span>}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.date}>
        <span className={styles.title}>{event.title}</span>
        <span className={styles.text}>{localizer.format(event.start as Date, 'LT')}</span>
        {!!event.resource?.location && <span className={styles.location}>{`${event.resource.location}`}</span>}
      </div>
    );
  }, [event, isAgenda, isMonth, localizer, styles, options.showMonthTime]);

  return options.showEventTooltip ? (
    <Tooltip
      theme="info-alt"
      placement="auto"
      interactive
      content={() => (
        <div data-testid={TEST_IDS.eventContent.tooltipContentWrap}>
          <EventDetails
            event={activeEvent}
            fields={options.displayFields}
            locationLabel={options.locationLabel}
            preformattedDescription={options.preformattedDescription}
            isForTooltip
          />
        </div>
      )}
    >
      {eventContentElement}
    </Tooltip>
  ) : (
    eventContentElement
  );
};
