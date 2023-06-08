import React from 'react';
import { toDataFrame } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestIds } from '../../constants';
import { DayDrawer } from '../DayDrawer';
import { CalendarPanel } from './CalendarPanel';

/**
 * Test Ids that are used only in tests
 */
const InTestIds = {
  dayDrawer: 'day-drawer',
  dayDrawerClose: 'day-drawer-close',
  buttonDay: 'button-day',
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
 * Mock Day
 */
jest.mock('../Day', () => ({
  Day: jest.fn(({ setDay, day, onSelectionChange }) => {
    return (
      <div>
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
 * Panel
 */
describe('Panel', () => {
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
  const getComponent = ({ options = { name: 'data' }, ...restProps }: any) => {
    const data = {
      series: [
        toDataFrame({
          name: 'data',
          fields: [],
        }),
      ],
    };
    return (
      <CalendarPanel data={data} options={options} timeRange={{ from: Date.now(), to: Date.now() }} {...restProps} />
    );
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
});
