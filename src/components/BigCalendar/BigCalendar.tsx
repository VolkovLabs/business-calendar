import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import { Calendar, Event } from 'react-big-calendar';
import { Global } from '@emotion/react';
import { PanelProps } from '@grafana/data';
import { Drawer, useStyles2, useTheme2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { useCalendarEvents, useCalendarRange, useLocalizer } from '../../hooks';
import { CalendarEvent, CalendarOptions } from '../../types';
import { BigEventContent } from '../BigEventContent';
import { BigToolbar } from '../BigToolbar';
import { EventDetails } from '../EventDetails';
import { BigCalendarStyles } from './BigCalendar.styles';

/**
 * Properties
 */
interface Props extends Pick<PanelProps<CalendarOptions>, 'height' | 'timeRange' | 'onChangeTimeRange' | 'options'> {
  /**
   * Events
   *
   * @type {CalendarEvent[]}
   */
  events: CalendarEvent[];
}

/**
 * Big Calendar
 * @param props
 */
export const BigCalendar: React.FC<Props> = ({ height, events, timeRange, onChangeTimeRange, options }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = useStyles2(BigCalendarStyles);

  /**
   * Localizer
   */
  const { localizer, messages } = useLocalizer();

  /**
   * Adopted Events for BigCalendar
   */
  const calendarEvents = useCalendarEvents(events);

  /**
   * Get props for event div element
   */
  const eventPropGetter = useCallback(
    (event: Event) => ({
      style: {
        backgroundColor: event.resource.color,
        color: event.resource.color ? theme.colors.emphasize(event.resource.color, 1) : '',
      },
    }),
    [theme.colors]
  );

  /**
   * Calendar Components
   */
  const components = useMemo(
    () => ({
      toolbar: BigToolbar,
      event: BigEventContent,
    }),
    []
  );

  /**
   * Manage calendar time range and view
   */
  const { date, view, onChangeView, onNavigate } = useCalendarRange(timeRange, onChangeTimeRange);

  /**
   * Event to show details
   */
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  /**
   * Select event
   */
  const onSelectEvent = useCallback(
    (event: Event) => {
      if (options.quickLinks) {
        /**
         * Open first link
         */
        const link = event.resource.links?.[0];
        if (link) {
          window.open(link.href, link.target || '_self');
          return;
        }
      }

      /**
       * Show event details
       */
      setActiveEvent({
        text: event.title as string,
        start: dayjs(event.start),
        end: event.end && !event.resource?.isEndless ? dayjs(event.end) : undefined,
        labels: [],
        ...(event.resource || {}),
      });
    },
    [options.quickLinks]
  );

  return (
    <div data-testid={TestIds.bigCalendar.root}>
      {activeEvent && (
        <Drawer title="Event Details" onClose={() => setActiveEvent(null)}>
          <EventDetails event={activeEvent} />
        </Drawer>
      )}
      <Global styles={styles.global} />
      <Calendar
        key={height}
        dayLayoutAlgorithm="no-overlap"
        localizer={localizer}
        messages={messages}
        events={calendarEvents}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        style={{ height }}
        views={{
          month: true,
          week: true,
          day: true,
        }}
        components={components}
        onNavigate={onNavigate}
        onView={onChangeView}
        date={date}
        view={view}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
};
