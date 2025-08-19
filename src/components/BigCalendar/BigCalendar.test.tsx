import { createTheme, dateTime, LinkTarget } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import dayjs from 'dayjs';
import React, { SyntheticEvent } from 'react';
import { Calendar, CalendarProps, Event } from 'react-big-calendar';

import { DEFAULT_VIEWS, TEST_IDS } from '../../constants';
import { useCalendarRange } from '../../hooks';
import { CalendarEvent, CalendarOptions, DateFormat, EventField, View } from '../../types';
import { BigCalendar } from './BigCalendar';

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  locationService: {
    getSearchObject: jest.fn(),
    partial: jest.fn(),
  },
}));

/**
 * Mock hooks
 */
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useLocalizer: jest.fn().mockImplementation(() => ({ localizer: jest.fn(), messages: {} }) as any),
  useCalendarRange: jest.fn(jest.requireActual('../../hooks').useCalendarRange),
}));

/**
 * Mock React Big Calendar
 */
jest.mock('react-big-calendar', () => ({
  ...jest.requireActual('react-big-calendar'),
  Calendar: jest.fn(() => null),
}));

/**
 * Mock styles
 */
jest.mock('./BigCalendar.styles', () => ({
  ...jest.requireActual('./BigCalendar.styles'),
  getLibStyles: () => ({
    global: '',
  }),
}));

/**
 * Mock timers
 */
jest.useFakeTimers();

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof BigCalendar>;

/**
 * Big Calendar
 */
describe('Big Calendar', () => {
  /**
   * Default Options
   */
  const defaultOptions: CalendarOptions = {
    dateFormat: DateFormat.EN_24H,
    displayFields: [],
    locationLabel: '',
    timeRangeType: 'default',
    views: DEFAULT_VIEWS,
    scrollToTime: {
      hours: 0,
      minutes: 0,
    },
    showEventTooltip: false,
    showMonthTime: true,
  };

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.bigCalendar);
  const selectors = getSelectors(screen);

  /**
   * Selectors
   */
  const theme = createTheme();

  /**
   * Event Details Selectors
   */
  const eventDetailsSelectors = getJestSelectors(TEST_IDS.eventDetails)(screen);

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Create Click Event
   */
  const createClickEvent = (target?: ParentNode): SyntheticEvent<HTMLElement> =>
    ({
      nativeEvent: {
        target: target as never,
      },
    }) as never;

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
    return <BigCalendar events={[]} timeRange={timeRange} options={defaultOptions} {...(props as any)} />;
  };

  beforeAll(() => {
    jest.spyOn(window, 'open').mockImplementation(() => ({}) as any);
  });

  beforeEach(() => {
    jest.mocked(window.open).mockReset();
  });

  afterAll(() => {
    jest.mocked(window.open).mockRestore();
  });

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

    const onEventClick = jest.fn();
    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '',
      links: [
        {
          title: 'link',
          onClick: onEventClick,
          href: '/',
        } as any,
        {
          title: 'link 2',
          onClick: onEventClick,
          href: '/',
          target: '_self',
        } as any,
      ],
    };
    render(getComponent({ events: [event] }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

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
    render(
      getComponent({
        events: [event],
        options: {
          views: DEFAULT_VIEWS,
          quickLinks: true,
          dateFormat: DateFormat.INHERIT,
          timeRangeType: 'default',
          displayFields: [],
          locationLabel: '',
          showEventTooltip: false,
          showMonthTime: true,
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Check if event link opened
     */
    expect(window.open).toHaveBeenCalledWith(link.href, link.target);
  });

  it('Should skip quick actions if clicked on link in tooltip', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

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
    render(
      getComponent({
        events: [event],
        options: {
          views: DEFAULT_VIEWS,
          quickLinks: true,
          dateFormat: DateFormat.INHERIT,
          timeRangeType: 'default',
          displayFields: [],
          locationLabel: '',
          showEventTooltip: false,
          showMonthTime: true,
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () =>
      calendarProps.onSelectEvent(
        selectedEvent,
        createClickEvent({
          nodeName: 'a',
        } as never)
      )
    );

    /**
     * Check if event link not opened
     */
    expect(window.open).not.toHaveBeenCalled();
  });

  it('Should open link with self by default', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

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
    render(
      getComponent({
        events: [event],
        options: {
          views: DEFAULT_VIEWS,
          quickLinks: true,
          dateFormat: DateFormat.INHERIT,
          timeRangeType: 'default',
          displayFields: [],
          locationLabel: '',
          showEventTooltip: false,
          showMonthTime: true,
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

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

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: dayjs(getSafeDate()),
      labels: [],
      color: '',
      links: [],
    };
    render(
      getComponent({
        events: [event],
        options: {
          views: DEFAULT_VIEWS,
          quickLinks: true,
          dateFormat: DateFormat.INHERIT,
          timeRangeType: 'default',
          displayFields: [],
          locationLabel: '',
          showEventTooltip: false,
          showMonthTime: true,
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

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

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [
            EventField.DESCRIPTION,
            EventField.LABELS,
            EventField.TEXT,
            EventField.TIME,
            EventField.DESCRIPTION,
            EventField.LOCATION,
          ],
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.root()).toBeInTheDocument();
    expect(eventDetailsSelectors.titleText()).toHaveTextContent(event.text);
    expect(eventDetailsSelectors.root()).toHaveTextContent(`Location: ${event.location}`);
    expect(eventDetailsSelectors.root()).toHaveTextContent(event.labels[0]);
    expect(eventDetailsSelectors.root()).toHaveTextContent(event.labels[1]);
  });

  it('Should display start time', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };
    render(getComponent({ events: [event], options: { ...defaultOptions, displayFields: [EventField.TIME] } }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.root()).toBeInTheDocument();
    expect(eventDetailsSelectors.root()).toHaveTextContent(`LLL`);
  });

  it('Should display links', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
      links: [
        {
          href: 'https://volkovlabs.io/',
          title: 'Volkovlabs',
          target: undefined,
          origin: {} as any,
        },
      ],
    };
    render(getComponent({ events: [event], options: { ...defaultOptions, displayFields: [EventField.LINKS] } }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.root()).toBeInTheDocument();
    expect(eventDetailsSelectors.root()).toHaveTextContent(`Volkovlabs`);
  });

  it('Should not show Description', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      description: ['Description'],
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };
    render(getComponent({ events: [event], options: { ...defaultOptions, displayFields: [EventField.LABELS] } }));

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.description(true, 0)).not.toBeInTheDocument();
  });

  it('Should show location with custom label', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      description: ['Description'],
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };
    render(
      getComponent({
        events: [event],
        options: { ...defaultOptions, locationLabel: 'Label:', displayFields: [EventField.LOCATION] },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.root()).toBeInTheDocument();
    expect(eventDetailsSelectors.root()).toHaveTextContent(`Label: Room`);
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

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION, EventField.LABELS, EventField.TEXT, EventField.TIME],
        },
      })
    );

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
        createClickEvent()
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

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION, EventField.LABELS, EventField.TEXT, EventField.TIME],
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    expect(eventDetailsSelectors.root()).toBeInTheDocument();
  });

  it('Should apply event color', () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const startColor = '#99999';
    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      labels: [],
      color: startColor,
    };

    const colorText = theme.colors.emphasize(theme.visualization.getColorByName(startColor), 1);

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION, EventField.LABELS, EventField.TEXT, EventField.TIME],
        },
      })
    );

    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;

    expect(selectedEvent).toBeDefined();

    expect(calendarProps.eventPropGetter(selectedEvent, getSafeDate(), getSafeDate(), false)).toEqual({
      style: expect.objectContaining({
        backgroundColor: event.color,
        color: colorText,
      }),
    });
  });

  it('Should apply event color with empty color', () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const startColor = '';
    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      labels: [],
      color: startColor,
    };

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION, EventField.LABELS, EventField.TEXT, EventField.TIME],
        },
      })
    );

    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;

    expect(selectedEvent).toBeDefined();

    expect(calendarProps.eventPropGetter(selectedEvent, getSafeDate(), getSafeDate(), false)).toEqual({
      style: expect.objectContaining({
        backgroundColor: event.color,
        color: '',
      }),
    });
  });

  it('Should show Description', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      description: ['Description'],
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION],
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.description(true, 0)).toBeInTheDocument();
    expect(eventDetailsSelectors.description(true, 0)).toHaveTextContent(`Description`);
  });

  it('Should show list of descriptions', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      description: ['Description 1', 'Description 2'],
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION],
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.description(false, 0)).toBeInTheDocument();
    expect(eventDetailsSelectors.description(false, 0)).toHaveTextContent(`Description 1`);
    expect(eventDetailsSelectors.description(false, 1)).toBeInTheDocument();
    expect(eventDetailsSelectors.description(false, 1)).toHaveTextContent(`Description 2`);
  });

  it('Should show <pre> tag', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      description: ['Description'],
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION],
          preformattedDescription: true,
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.root()).toBeInTheDocument();
    expect(eventDetailsSelectors.preformatted(false, 0)).toBeInTheDocument();
    expect(eventDetailsSelectors.preformatted(false, 0)).toHaveTextContent(`Description`);
  });

  it('Should show list of <pre> tag`s', async () => {
    let calendarProps: Required<CalendarProps> = {} as any;
    jest.mocked(Calendar).mockImplementation((props: any): any => {
      calendarProps = props;
      return null;
    });

    const event: CalendarEvent = {
      text: 'hello',
      start: dayjs(getSafeDate()),
      end: undefined,
      description: ['Description 1', 'Description 2'],
      labels: ['111', '222'],
      color: '#99999',
      location: 'Room',
    };

    render(
      getComponent({
        events: [event],
        options: {
          ...defaultOptions,
          displayFields: [EventField.DESCRIPTION],
          preformattedDescription: true,
        },
      })
    );

    expect(eventDetailsSelectors.root(true)).not.toBeInTheDocument();

    /**
     * Event selecting
     */
    const selectedEvent = calendarProps.events.find(({ title }: any) => title === event.text) as Event;
    expect(selectedEvent).toBeDefined();
    await act(async () => calendarProps.onSelectEvent(selectedEvent, createClickEvent()));

    /**
     * Event Details
     */
    expect(eventDetailsSelectors.root()).toBeInTheDocument();
    expect(eventDetailsSelectors.preformatted(false, 0)).toBeInTheDocument();
    expect(eventDetailsSelectors.preformatted(false, 0)).toHaveTextContent(`Description 1`);

    expect(eventDetailsSelectors.preformatted(false, 1)).toBeInTheDocument();
    expect(eventDetailsSelectors.preformatted(false, 1)).toHaveTextContent(`Description 2`);
  });

  it('Should keep refresh on time range change', () => {
    let changeTimeRange: any;

    /**
     * Mock calendar range
     */
    jest.mocked(useCalendarRange).mockImplementation((timeRange, onChangeTimeRange) => {
      changeTimeRange = onChangeTimeRange;
      return {
        date: new Date(),
        view: View.DAY,
        onChangeView: jest.fn(),
        onNavigate: jest.fn(),
      };
    });

    /**
     * Mock location service
     */
    jest.mocked(locationService.getSearchObject).mockReturnValueOnce({
      refresh: '5s',
    });

    const onChangeTimeRange = jest.fn();

    render(getComponent({ events: [], onChangeTimeRange }));

    changeTimeRange({
      from: '123',
      to: '321',
    });

    /**
     * Check if time range changed
     */
    expect(onChangeTimeRange).toHaveBeenCalledWith({
      from: '123',
      to: '321',
    });

    /**
     * Check if update location wait until timeout
     */
    expect(locationService.partial).not.toHaveBeenCalled();

    /**
     * Run timer
     */
    jest.runOnlyPendingTimers();

    /**
     * Check if location updated
     */
    expect(locationService.partial).toHaveBeenCalledWith(
      {
        refresh: '5s',
      },
      true
    );
  });
});
