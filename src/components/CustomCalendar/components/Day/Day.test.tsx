import dayjs from 'dayjs';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TestIds } from '../../../../constants';
import { Day } from './Day';

/**
 * Test Ids that are used only in tests
 */
const InTestIds = {
  calendarEntry: 'calendar-entry',
};

/**
 * Mock Calendar Entry
 */
jest.mock('../CalendarEntry', () => ({
  CalendarEntry: jest.fn(({ onClick }) => <div data-testid={InTestIds.calendarEntry} onClick={onClick} />),
}));

/**
 * Mock AutoSizer
 */
jest.mock('react-virtualized-auto-sizer', () => jest.fn(({ children }) => children({ height: 100 })));

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof Day>;

/**
 * Day
 */
describe('Day', () => {
  const setDay = jest.fn();
  const setEvent = jest.fn();
  const onSelectionChange = jest.fn();

  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return (
      <Day
        day={dayjs(getSafeDate())}
        from={dayjs(getSafeDate())}
        to={dayjs(getSafeDate())}
        events={[]}
        onSelectionChange={onSelectionChange}
        setDay={setDay}
        setEvent={setEvent}
        {...(restProps as any)}
      />
    );
  };

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  it('Should find component', () => {
    render(getComponent({}));

    expect(screen.getByTestId(TestIds.day.root)).toBeInTheDocument();
  });

  it('Should apply time range', () => {
    const onSelectionChange = jest.fn();
    render(getComponent({ onSelectionChange }));

    /**
     * Select interval
     */
    fireEvent.click(screen.getByTestId(TestIds.day.root));

    expect(onSelectionChange).toHaveBeenCalledWith(true);
  });

  it('Should show day if day > 1', () => {
    render(getComponent({}));

    expect(screen.getByTestId(TestIds.day.dayDate)).toHaveTextContent(dayjs(getSafeDate()).format('D'));
  });

  it('Should show month with day if day = 1', () => {
    const firstDayDate = dayjs(new Date('2023-02-01'));
    render(getComponent({ day: firstDayDate }));

    expect(screen.getByTestId(TestIds.day.dayDate)).toHaveTextContent(firstDayDate.format('MMM D'));
  });

  it('Should show more events button', () => {
    const setDay = jest.fn();
    render(
      getComponent({
        events: [{ name: 'event 1' }, { name: 'event 2' }, { name: 'event 3' }, { name: 'event 4' }] as any,
        setDay,
      })
    );

    expect(screen.getByTestId(TestIds.day.buttonShowMore)).toBeInTheDocument();

    /**
     * Click show more events button
     */
    fireEvent.click(screen.getByTestId(TestIds.day.buttonShowMore));

    expect(setDay).toHaveBeenCalled();
  });

  it('Should set day', () => {
    const setDay = jest.fn();
    const setEvent = jest.fn();
    render(
      getComponent({
        events: [{ name: 'event 1' }, { name: 'event 2' }] as any,
        setDay,
        setEvent,
      })
    );

    const calendarEntries = screen.getAllByTestId(InTestIds.calendarEntry);
    expect(calendarEntries[0]).toBeInTheDocument();

    /**
     * Select event
     */
    fireEvent.click(calendarEntries[0]);

    expect(setDay).toHaveBeenCalled();
    expect(setEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'event 1',
      })
    );
  });
});
