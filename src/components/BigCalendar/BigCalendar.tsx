import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import { Calendar, Event } from 'react-big-calendar';
import { Global } from '@emotion/react';
import { PanelProps } from '@grafana/data';
import { Drawer, useStyles2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { useCalendarEvents, useCalendarRange, useLocalizer } from '../../hooks';
import { CalendarEvent } from '../../types';
import { BigToolbar } from '../BigToolbar';
import { EventDetails } from '../EventDetails';
import { Styles } from './styles';

/**
 * Properties
 */
interface Props extends Pick<PanelProps, 'height' | 'timeRange' | 'onChangeTimeRange'> {
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
export const BigCalendar: React.FC<Props> = ({ height, events, timeRange, onChangeTimeRange }) => {
  /**
   * Theme
   */
  const styles = useStyles2(Styles);

  /**
   * Localizer
   */
  const localizer = useLocalizer();

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
      },
    }),
    []
  );

  /**
   * Calendar Components
   */
  const components = useMemo(
    () => ({
      toolbar: BigToolbar,
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
   * Select event to show details
   */
  const onSelectEvent = useCallback((event: Event) => {
    setActiveEvent({
      text: event.title as string,
      start: dayjs(event.start),
      end: event.end && !event.resource?.isEndless ? dayjs(event.end) : undefined,
      ...(event.resource || {}),
    });
  }, []);

  return (
    <div data-testid={TestIds.bigCalendar.root}>
      {activeEvent && (
        <Drawer title="Event Details" onClose={() => setActiveEvent(null)}>
          <EventDetails event={activeEvent} />
        </Drawer>
      )}
      <Global styles={styles.global} />
      <Calendar
        localizer={localizer}
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
