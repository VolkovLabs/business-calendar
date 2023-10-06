import dayjs from 'dayjs';
import React from 'react';
import { Calendar, CalendarProps, Event } from 'react-big-calendar';
import { dateTime, LinkTarget } from '@grafana/data';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import { DefaultViews, TestIds } from '../../constants';
import { CalendarEvent } from '../../types';
import { BigCalendar } from './BigCalendar';

/**
 * Mock hooks
 */
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLocalizer: jest.fn().mockImplementation(() => ({ localizer: jest.fn(), messages: {} }) as any),
}));

/**
 * Mock React Big Calendar
 */
jest.mock('react-big-calendar', () => ({
  ...jest.requireActual('react-big-calendar'),
  Calendar: jest.fn(() => null),
}));

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof BigCalendar>;

/**
 * Big Calendar
 */
describe('Big Calendar', () => {
  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TestIds.bigCalendar);
  const selectors = getSelectors(screen);

  /**
   * Event Details Selectors
   */
  const eventDetailsSelectors = getJestSelectors(TestIds.eventDetails)(screen);

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    const timeRange = {
      from: dateTime(getSafeDate()),
      to: dateTime(getSafeDate()),
      raw: {
        from: dateTime(getSafeDate()),
        to: dateTime(getSafeDate()),
      },
    };
    return <BigCalendar events={[]} timeRange={timeRange} options={{ views: DefaultViews }} {...(props as any)} />;
  };

  it('Should find component', () => {
    render(getComponent({}));

    expect(selectors.root()).toBeInTheDocument();
  });

  it('Should show no views error', () => {
    render(getComponent({ options: { views: [] } as any }));

    expect(selectors.noViewsMessage()).toBeInTheDocument();
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

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, {} as any));

    /**
     * Check if event details shown
     */
    expect(selectors.drawerClose()).toBeInTheDocument();

    /**
     * Close event details drawer
     */
    await act(() => fireEvent.click(selectors.drawerClose()));

    /**
     * Check if event details closed
     */
    expect(selectors.drawerClose(true)).not.toBeInTheDocument();
  });

  it('Should open link if quickLinks enabled', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    jest.spyOn(window, 'open').mockImplementationOnce(() => ({}) as any);

    const link = {
      href: 'https://123.com',
      target: '_blank' as LinkTarget,
      title: '',
      origin: {} as any,
    };

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '',
      links: [link],
    };
    render(getComponent({ events: [event], options: { views: DefaultViews, quickLinks: true, autoScroll: false } }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, {} as any));

    /**
     * Check if event link opened
     */
    expect(window.open).toHaveBeenCalledWith(link.href, link.target);
  });

  it('Should open link with self by default', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    jest.spyOn(window, 'open').mockImplementationOnce(() => ({}) as any);

    const link = {
      href: 'https://123.com',
      target: undefined,
      title: '',
      origin: {} as any,
    };

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '',
      links: [link],
    };
    render(getComponent({ events: [event], options: { views: DefaultViews, quickLinks: true, autoScroll: false } }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, {} as any));

    /**
     * Check if event link opened
     */
    expect(window.open).toHaveBeenCalledWith(link.href, '_self');
  });

  it('Should show event details if link is not specified', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    jest.spyOn(window, 'open').mockImplementationOnce(() => ({}) as any);

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '',
      links: [],
    };
    render(getComponent({ events: [event], options: { views: DefaultViews, quickLinks: true, autoScroll: false } }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, {} as any));

    /**
     * Check if event details shown
     */
    expect(selectors.drawerClose()).toBeInTheDocument();
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
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };
    render(getComponent({ events: [event] }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, {} as any));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.root()).toBeInTheDocument();
    expect(eventDetailsSelectors.titleText()).toHaveTextContent(event.text);
    expect(eventDetailsSelectors.root()).toHaveTextContent(`Location: ${event.location}`);
    expect(eventDetailsSelectors.root()).toHaveTextContent(event.labels[0]);
    expect(eventDetailsSelectors.root()).toHaveTextContent(event.labels[1]);
  });

  it('Should show event info with empty resource', async () => {
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
    };
    render(getComponent({ events: [event] }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();

    await act(async () =>
      calendarProps.onSelectEvent(
        {
          ...selectedEvent,
          resource: null,
        },
        {} as any
      )
    );

    expect(eventDetailsSelectors.root()).toBeInTheDocument();
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
    };
    render(getComponent({ events: [event] }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, {} as any));

    expect(eventDetailsSelectors.root()).toBeInTheDocument();
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
