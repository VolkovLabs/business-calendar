import React, { useMemo, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { Global } from '@emotion/react';
import { PanelProps } from '@grafana/data';
import { useStyles2, Drawer } from '@grafana/ui';
import { Calendar, Event } from 'react-big-calendar';
import { TestIds } from '../../constants';
import { CalendarEvent } from '../../types';
import { EventDetails } from '../EventDetails';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Styles } from './styles';
import { Toolbar } from './components';
import { useCalendarRange, useCalendarEvents as useBigCalendarEvents, useLocalizer } from './hooks';

/**
 * Properties
 */
interface Props extends Pick<PanelProps, 'height' | 'timeRange' | 'onChangeTimeRange'> {
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
  const calendarEvents = useBigCalendarEvents(events);

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
   * Custom Calendar Components
   */
  const components = useMemo(
    () => ({
      toolbar: Toolbar,
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
      end: event.end ? dayjs(event.end) : undefined,
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
