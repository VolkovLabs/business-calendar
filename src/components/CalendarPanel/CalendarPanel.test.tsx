import React from 'react';
import { dateTime, FieldType, LoadingState, PanelData, toDataFrame, FieldColorModeId } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { TestIds } from '../../constants';
import { DayDrawer } from '../DayDrawer';
import { useAnnotations } from '../../utils';
import { CalendarPanel } from './CalendarPanel';

/**
 * Test Ids that are used only in tests
 */
const InTestIds = {
  dayDrawer: 'day-drawer',
  dayDrawerClose: 'day-drawer-close',
  buttonDay: 'button-day',
  daySelectInterval: 'day-select-interval',
  dayEvents: 'day-events',
  dayEvent: 'day-events event',
  dayEventName: 'day-events event-name',
  dayEventLabel: 'day-events event-label',
  dayEventColor: 'day-events event-color',
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
 * Mock Day
 */
jest.mock('../Day', () => ({
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
}));

/**
 * Mock DayDrawer
 */
jest.mock('../DayDrawer', () => ({
  DayDrawer: jest.fn(() => null),
}));

/**
 * Mock utils
 */
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  useAnnotations: jest.fn(() => [{ id: '123' }]),
}));

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof CalendarPanel>;

/**
 * Panel
 */
describe('Panel', () => {
  /**
   * Add ScrollTo method
   */
  window.HTMLElement.prototype.scrollTo = jest.fn();

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  /**
   * Render Without Warning
   * @param component
   */
  const renderWithoutWarning = async (component: React.ReactElement) => {
    await act(async () => {
      await render(component);

      /**
       * Remove act warnings
       * Wait timeout until promise resolves. Because there is not loading element for checking promise resolves
       */
      await new Promise((resolve) => setTimeout(resolve, 1));
    });
  };

  /**
   * Get Tested Component
   * @param options
   * @param restProps
   */
  const getComponent = ({ options = { autoScroll: true }, ...restProps }: Partial<Props>) => {
    const allOptions = {
      textField: 'Event Name',
      timeField: 'Event Start',
      endTimeField: 'Event End',
      labelFields: ['Event Name'],
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
    const data: PanelData = {
      state: LoadingState.Done,
      timeRange,
      series: [
        toDataFrame({
          name: 'data',
          fields: [
            {
              type: FieldType.string,
              name: allOptions.textField,
              values: ['event1', 'event2', 'event3'],
              getLinks: () => null,
            },
            {
              type: FieldType.time,
              name: allOptions.timeField,
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
            {
              type: FieldType.time,
              name: allOptions.endTimeField,
              values: [getSafeDate(), getSafeDate(), getSafeDate()],
            },
          ],
        }),
      ],
    };
    return <CalendarPanel data={data} options={allOptions} timeRange={timeRange} {...(restProps as any)} />;
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
    await renderWithoutWarning(getComponent({}));

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

    await renderWithoutWarning(getComponent({}));

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
    await renderWithoutWarning(
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
    await renderWithoutWarning(getComponent({}));

    expect(screen.getByTestId(InTestIds.dayEvents)).toBeInTheDocument();
    expect(within(screen.getByTestId(InTestIds.dayEvents)).getAllByTestId(InTestIds.dayEvent)).toHaveLength(3);
  });

  it('Should apply annotations', async () => {
    jest.mocked(useAnnotations).mockImplementation(
      () =>
        [
          {
            time: getSafeDate(),
            timeEnd: getSafeDate(),
          },
          {
            time: getSafeDate(),
          },
        ] as any
    );

    await renderWithoutWarning(
      getComponent({
        options: {
          autoScroll: true,
          annotations: true,
        },
      })
    );

    /**
     * Check if all passed and annotation events are rendered
     */
    expect(screen.getByTestId(InTestIds.dayEvents)).toBeInTheDocument();
    expect(within(screen.getByTestId(InTestIds.dayEvents)).getAllByTestId(InTestIds.dayEvent)).toHaveLength(5);
  });

  it('Should work if frame does not contain text and start fields', async () => {
    await renderWithoutWarning(
      getComponent({
        data: {
          state: LoadingState.Done,
          timeRange: null as any,
          series: [
            toDataFrame({
              name: 'data',
              fields: [
                {
                  type: FieldType.string,
                  name: 'some field',
                  values: ['event1', 'event2', 'event3'],
                  getLinks: () => null,
                },
              ],
            }),
          ],
        },
      })
    );

    expect(screen.queryByTestId(InTestIds.dayEvents)).not.toBeInTheDocument();
  });

  it('Should apply events if no textField and timeField in options', async () => {
    await renderWithoutWarning(
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

  it('Should apply color mode', async () => {
    await renderWithoutWarning(
      getComponent({
        fieldConfig: {
          defaults: {
            color: {
              mode: FieldColorModeId.ContinuousBlPu,
            },
          },
          overrides: [],
        },
      })
    );

    expect(screen.getByTestId(InTestIds.dayEvents)).toBeInTheDocument();

    /**
     * Check applying mode colors
     */
    const eventsScreen = within(screen.getByTestId(InTestIds.dayEvents));
    const eventColors = eventsScreen.getAllByTestId(InTestIds.dayEventColor);
    expect(eventColors[0]).toHaveTextContent('#5794F2');
    expect(eventColors[1]).toHaveTextContent('#B877D9');
    expect(eventColors[2]).toHaveTextContent('#5794F2');
  });

  it('Should apply fixed color mode', async () => {
    await renderWithoutWarning(
      getComponent({
        fieldConfig: {
          defaults: {
            color: {
              mode: FieldColorModeId.Fixed,
              fixedColor: '#999999',
            },
          },
          overrides: [],
        },
      })
    );

    expect(screen.getByTestId(InTestIds.dayEvents)).toBeInTheDocument();

    /**
     * Check applying fixed color
     */
    const eventsScreen = within(screen.getByTestId(InTestIds.dayEvents));
    const eventColors = eventsScreen.getAllByTestId(InTestIds.dayEventColor);
    expect(eventColors[0]).toHaveTextContent('#999999');
    expect(eventColors[1]).toHaveTextContent('#999999');
    expect(eventColors[2]).toHaveTextContent('#999999');
  });
});
