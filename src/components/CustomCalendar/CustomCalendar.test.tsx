import React from 'react';
import dayjs from 'dayjs';
import { dateTime } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { TestIds } from '../../constants';
import { DayDrawer } from './components';
import { CustomCalendar } from './CustomCalendar';

/**
 * Test Ids that are used only in tests
 */
const InTestIds = {
  buttonDay: 'button-day',
  dayDrawer: 'day-drawer',
  dayDrawerClose: 'day-drawer-close',
  dayEvent: 'day-events event',
  dayEventColor: 'day-events event-color',
  dayEventLabel: 'day-events event-label',
  dayEventName: 'day-events event-name',
  dayEvents: 'day-events',
  daySelectInterval: 'day-select-interval',
};

/**
 * Mock @grafana/runtime
 */
jest.mock('@grafana/runtime', () => ({
  getBackendSrv: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve()),
  })),
}));

/**
 * Mock Calendar Components
 */
jest.mock('./components', () => ({
  Day: jest.fn(({ setDay, day, onSelectionChange, events }) => {
    return (
      <div>
        {events.length && (
          <div data-testid={InTestIds.dayEvents}>
            {events.map((event: any, index: number) => (
              <div key={index} data-testid={InTestIds.dayEvent}>
                <div data-testid={InTestIds.dayEventName}>{event.name}</div>
                <div data-testid={InTestIds.dayEventLabel}>{event.label}</div>
                <div data-testid={InTestIds.dayEventColor}>{event.color}</div>
              </div>
            ))}
          </div>
        )}
        <button data-testid={InTestIds.buttonDay} onClick={() => setDay(day)}>
          open
        </button>
        <button data-testid={InTestIds.daySelectInterval} onClick={() => onSelectionChange(day)}>
          select time range
        </button>
      </div>
    );
  }),
  DayDrawer: jest.fn(() => null),
}));

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof CustomCalendar>;

/**
 * Custom Calendar
 */
describe('Custom Calendar', () => {
  /**
   * Add ScrollTo method
   */
  window.HTMLElement.prototype.scrollTo = jest.fn();

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Get Tested Component
   * @param options
   * @param restProps
   */
  const getComponent = ({ options = { autoScroll: true }, ...restProps }: Partial<Props>) => {
    const allOptions = {
      ...options,
    };
    const timeRange = {
      from: dateTime(getSafeDate()),
      to: dateTime(getSafeDate()),
      raw: {
        from: dateTime(getSafeDate()),
        to: dateTime(getSafeDate()),
      },
    };
    const events = [
      { text: 'event1', start: dayjs(getSafeDate()), end: dayjs(getSafeDate()), color: '#5794F2' },
      { text: 'event2', start: dayjs(getSafeDate()), end: dayjs(getSafeDate()), color: '#B877D9' },
      { text: 'event3', start: dayjs(getSafeDate()), end: dayjs(getSafeDate()), color: '#5794F2' },
    ];
    return <CustomCalendar events={events} options={allOptions} timeRange={timeRange} {...(restProps as any)} />;
  };

  beforeAll(() => {
    const getMock = jest.fn(() => Promise.resolve());
    jest.mocked(getBackendSrv).mockImplementation(
      () =>
        ({
          get: getMock,
        } as any)
    );
  });

  it('Should find component', async () => {
    await render(getComponent({}));

    await waitFor(() => expect(screen.getByTestId(TestIds.panel.root)).toBeInTheDocument());
  });

  it('Should open DayDrawer', async () => {
    jest.mocked(DayDrawer).mockImplementation(({ onClose }) => (
      <div data-testid={InTestIds.dayDrawer}>
        <button onClick={onClose} data-testid={InTestIds.dayDrawerClose}>
          close
        </button>
      </div>
    ));

    await render(getComponent({}));

    /**
     * Check if day drawer is hidden
     */
    expect(screen.queryByTestId(InTestIds.dayDrawer)).not.toBeInTheDocument();

    /**
     * Open day drawer for first day
     */
    const allDays = screen.getAllByTestId(InTestIds.buttonDay);
    fireEvent.click(allDays[0]);

    /**
     * Check day drawer presence
     */
    expect(screen.getByTestId(InTestIds.dayDrawer)).toBeInTheDocument();

    /**
     * Close day drawer
     */
    fireEvent.click(screen.getByTestId(InTestIds.dayDrawerClose));

    /**
     * Check if day drawer closed
     */
    expect(screen.queryByTestId(InTestIds.dayDrawer)).not.toBeInTheDocument();
  });

  it('Should apply time selection button', async () => {
    const onChangeTimeRange = jest.fn();
    await render(
      getComponent({
        onChangeTimeRange,
      })
    );

    expect(screen.queryByTestId(TestIds.panel.buttonApplyInterval)).not.toBeInTheDocument();

    /**
     * Select interval
     */
    const allDays = screen.getAllByTestId(InTestIds.daySelectInterval);
    fireEvent.click(allDays[0]);

    /**
     * Check apply interval button presence
     */
    expect(screen.getByTestId(TestIds.panel.buttonApplyInterval)).toBeInTheDocument();

    /**
     * Apply interval
     */
    fireEvent.click(screen.getByTestId(TestIds.panel.buttonApplyInterval));

    expect(onChangeTimeRange).toHaveBeenCalled();
  });

  it('Should apply events', async () => {
    await render(getComponent({}));

    expect(screen.getByTestId(InTestIds.dayEvents)).toBeInTheDocument();
    expect(within(screen.getByTestId(InTestIds.dayEvents)).getAllByTestId(InTestIds.dayEvent)).toHaveLength(3);
  });

  it('Should apply events if no textField and timeField in options', async () => {
    await render(
      getComponent({
        options: {
          textField: '',
          timeField: '',
        } as any,
      })
    );

    expect(screen.getByTestId(InTestIds.dayEvents)).toBeInTheDocument();
    expect(within(screen.getByTestId(InTestIds.dayEvents)).getAllByTestId(InTestIds.dayEvent)).toHaveLength(3);
  });

  it('Should apply color', async () => {
    await render(getComponent({}));

    expect(screen.getByTestId(InTestIds.dayEvents)).toBeInTheDocument();

    /**
     * Check applying colors
     */
    const eventsScreen = within(screen.getByTestId(InTestIds.dayEvents));
    const eventColors = eventsScreen.getAllByTestId(InTestIds.dayEventColor);
    expect(eventColors[0]).toHaveTextContent('#5794F2');
    expect(eventColors[1]).toHaveTextContent('#B877D9');
    expect(eventColors[2]).toHaveTextContent('#5794F2');
  });
});
