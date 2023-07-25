import dayjs from 'dayjs';
import React from 'react';
import { Calendar, CalendarProps, Event } from 'react-big-calendar';
import { dateTime } from '@grafana/data';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
import { CalendarEvent } from '../../types';
import { EventDetails } from '../EventDetails';
import { BigCalendar } from './BigCalendar';

/**
 * Mock hooks
 */
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLocalizer: jest.fn(),
}));

/**
 * Mock React Big Calendar
 */
jest.mock('react-big-calendar', () => ({
  ...jest.requireActual('react-big-calendar'),
  Calendar: jest.fn(() => null),
}));

/**
 * Mock Event Details
 */
jest.mock('../EventDetails', () => ({
  EventDetails: jest.fn(() => null),
}));

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof BigCalendar>;

/**
 * Big Calendar
 */
describe('Big Calendar', () => {
  beforeEach(() => {
    jest.mocked(EventDetails).mockClear();
  });

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    const events: CalendarEvent[] = [];
    const timeRange = {
      from: dateTime(getSafeDate()),
      to: dateTime(getSafeDate()),
      raw: {
        from: dateTime(getSafeDate()),
        to: dateTime(getSafeDate()),
      },
    };
    return <BigCalendar events={events} timeRange={timeRange} {...(props as any)} />;
  };

  it('Should find component', () => {
    render(getComponent({}));

    expect(screen.getByTestId(TestIds.bigCalendar.root)).toBeInTheDocument();
  });

  it('Should show and close event details', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '',
    };
    render(getComponent({ events: [event] }));

    expect(screen.queryByTestId(TestIds.eventDetails.root)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(() => calendarProps.onSelectEvent(selectedEvent, {} as any));

    /**
     * Check if event details shown
     */
    expect(screen.getByLabelText(TestIds.bigCalendar.drawerClose)).toBeInTheDocument();

    /**
     * Close event details drawer
     */
    await act(() => fireEvent.click(screen.getByLabelText(TestIds.bigCalendar.drawerClose)));

    /**
     * Check if event details closed
     */
    expect(screen.queryByLabelText(TestIds.bigCalendar.drawerClose)).not.toBeInTheDocument();
  });

  it('Should pass all event info to event details', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '#99999',
      description: '123',
    };
    render(getComponent({ events: [event] }));

    expect(screen.queryByTestId(TestIds.eventDetails.root)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(() => calendarProps.onSelectEvent(selectedEvent, {} as any));

    expect(EventDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        event: expect.objectContaining({
          description: event.description,
          labels: event.labels,
          color: event.color,
        }),
      }),
      expect.anything()
    );
  });

  it('Should pass all event info with empty resource', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '#99999',
      description: '123',
    };
    render(getComponent({ events: [event] }));

    expect(screen.queryByTestId(TestIds.eventDetails.root)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(() =>
      calendarProps.onSelectEvent(
        {
          ...selectedEvent,
          resource: null,
        },
        {} as any
      )
    );

    expect(EventDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        event: expect.objectContaining({
          text: event.text,
        }),
      }),
      expect.anything()
    );
  });

  it('Should not pass end time to event details', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      labels: [],
      color: '#99999',
      description: '123',
    };
    render(getComponent({ events: [event] }));

    expect(screen.queryByTestId(TestIds.eventDetails.root)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(() => calendarProps.onSelectEvent(selectedEvent, {} as any));

    expect(EventDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        event: expect.objectContaining({
          end: undefined,
        }),
      }),
      expect.anything()
    );
  });

  it('Should apply event color', () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      labels: [],
      color: '#99999',
      description: '123',
    };
    render(getComponent({ events: [event] }));

    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    expect(calendarProps.eventPropGetter(selectedEvent, getSafeDate(), getSafeDate(), false)).toEqual({
      style: expect.objectContaining({
        backgroundColor: event.color,
      }),
    });
  });
});
