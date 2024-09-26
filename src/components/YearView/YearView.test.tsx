import { fireEvent, render, screen, within } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import dayjs from 'dayjs';
import React from 'react';
import { dayjsLocalizer, Navigate } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { YearView } from './YearView';

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof YearView>;

describe('Year View', () => {
  /**
   * Localizer
   */
  const localizer = dayjsLocalizer(dayjs);

  /**
   * Set Year View Formats
   */
  (localizer.formats as any).yearHeaderFormat = 'YYYY';
  (localizer.formats as any).yearMonthFormat = 'MMMM';
  (localizer.formats as any).yearWeekFormat = 'dd';
  (localizer.formats as any).yearDateFormat = 'D';

  /**
   * Mock Format
   */
  localizer.format = jest.fn((date, format) => {
    return dayjs(date as Date).format((localizer.formats as any)[format]);
  });

  /**
   * Safe Date
   */
  const safeDate = new Date('2022-02-02');

  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <YearView localizer={localizer} date={safeDate} getNow={() => safeDate} {...(restProps as any)} />;
  };

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.yearView);
  const selectors = getSelectors(screen);

  it('Should render year view with all months', () => {
    render(getComponent({}));

    expect(selectors.root()).toBeInTheDocument();

    for (let i = 0; i < 12; i += 1) {
      expect(selectors.month(false, i)).toBeInTheDocument();
    }
  });

  it('Should render prev and next days', () => {
    render(getComponent({}));

    expect(selectors.root()).toBeInTheDocument();

    const month = selectors.month(false, 9);
    expect(month).toBeInTheDocument();

    const monthSelectors = getSelectors(within(month));
    expect(monthSelectors.prevDate(false, 8, 27)).toBeInTheDocument();
    expect(monthSelectors.nextDate(false, 10, 5)).toBeInTheDocument();
  });

  it('Should render with events', () => {
    /**
     * Events
     */
    const events = [
      {
        start: new Date('2023-09-09T11:15:00'),
        end: new Date('2023-09-09T12:15:00'),
        title: 'Event 1',
        resource: {
          color: '#7EB26D',
        },
      },
      {
        start: new Date('2023-09-09T10:15:00'),
        end: new Date('2023-09-09T11:15:00'),
        title: 'Event 2',
        resource: {
          color: '#EAB839',
        },
      },
    ];
    render(getComponent({ events }));

    expect(selectors.root()).toBeInTheDocument();

    const month = selectors.month(false, 8);
    expect(month).toBeInTheDocument();

    const monthSelectors = getSelectors(within(month));
    expect(monthSelectors.prevDate(false, 7, 28)).toBeInTheDocument();
    expect(monthSelectors.nextDate(false, 9, 1)).toBeInTheDocument();

    expect(monthSelectors.date(false, 9)).toBeInTheDocument();

    /**
     * Date with events
     */
    const dateWithEvents = monthSelectors.date(false, 9);

    /**
     * Dots
     */
    const spans = dateWithEvents.querySelectorAll('span');

    /**
     * Should be 2 span elements
     */
    expect(spans.length).toBeGreaterThan(0);
    expect(spans.length).toBe(2);

    /**
     * Date without events
     */
    const dateWithoutEvents = monthSelectors.date(false, 10);

    /**
     * Dots
     */
    const spansNone = dateWithoutEvents.querySelectorAll('span');

    /**
     * Should be 0
     */
    expect(spansNone.length).toBeLessThan(1);
  });

  it('Should render with multi day events', () => {
    /**
     * Events
     */
    const events = [
      {
        start: new Date('2023-09-09T11:15:00'),
        end: new Date('2023-09-09T12:15:00'),
        title: 'Event 1',
        resource: {
          color: '#7EB26D',
        },
      },
      {
        start: new Date('2023-09-10T10:15:00'),
        end: new Date('2023-09-11T11:15:00'),
        title: 'Event 2',
        resource: {
          color: '#EAB839',
        },
      },
    ];
    render(getComponent({ events }));

    expect(selectors.root()).toBeInTheDocument();

    const month = selectors.month(false, 8);
    expect(month).toBeInTheDocument();

    const monthSelectors = getSelectors(within(month));
    expect(monthSelectors.prevDate(false, 7, 28)).toBeInTheDocument();
    expect(monthSelectors.nextDate(false, 9, 1)).toBeInTheDocument();
    expect(monthSelectors.date(false, 9)).toBeInTheDocument();

    /**
     * Date with events
     */
    const dateWithEvents = monthSelectors.date(false, 9);

    /**
     * Dots
     */
    const spans = dateWithEvents.querySelectorAll('span');

    /**
     * Should be 1 span elements
     */
    expect(spans.length).toBeGreaterThan(0);
    expect(spans.length).toBe(1);

    /**
     * Date without events
     */
    const dateWithoutEvents = monthSelectors.date(false, 12);

    /**
     * Dots
     */
    const spansNone = dateWithoutEvents.querySelectorAll('span');

    /**
     * Should be 0
     */
    expect(spansNone.length).toBeLessThan(1);
    const day10 = monthSelectors.date(false, 10);
    const day11 = monthSelectors.date(false, 11);

    /**
     * Should be 1 event as start at 10 day
     */
    expect(day10.querySelectorAll('span').length).toEqual(1);

    /**
     * Should be 1 event as end at 11 day
     */
    expect(day11.querySelectorAll('span').length).toEqual(1);
  });

  it('Should render with multi day events in different months', () => {
    /**
     * Events
     */
    const events = [
      {
        start: new Date('2023-09-09T11:15:00'),
        end: new Date('2023-09-09T12:15:00'),
        title: 'Event 1',
        resource: {
          color: '#7EB26D',
        },
      },
      {
        start: new Date('2023-09-30T10:15:00'),
        end: new Date('2023-10-01T11:15:00'),
        title: 'Event 2',
        resource: {
          color: '#EAB839',
        },
      },
    ];
    render(getComponent({ events }));

    expect(selectors.root()).toBeInTheDocument();

    const september = selectors.month(false, 8);
    expect(september).toBeInTheDocument();

    const monthSelectors = getSelectors(within(september));
    expect(monthSelectors.prevDate(false, 7, 28)).toBeInTheDocument();
    expect(monthSelectors.nextDate(false, 9, 1)).toBeInTheDocument();
    expect(monthSelectors.date(false, 9)).toBeInTheDocument();

    /**
     * Date with events
     */
    const dateWithEvents = monthSelectors.date(false, 9);

    /**
     * Dots
     */
    const spans = dateWithEvents.querySelectorAll('span');

    /**
     * Should be 1 span elements
     */
    expect(spans.length).toBeGreaterThan(0);
    expect(spans.length).toEqual(1);

    const day30 = monthSelectors.date(false, 30);
    /**
     * Should be 1 event as start at 10 day
     */
    expect(day30.querySelectorAll('span').length).toEqual(1);

    const october = selectors.month(false, 9);
    expect(october).toBeInTheDocument();

    const monthOctoberSelectors = getSelectors(within(october));
    expect(monthOctoberSelectors.prevDate(false, 8, 28)).toBeInTheDocument();
    expect(monthOctoberSelectors.nextDate(false, 10, 1)).toBeInTheDocument();

    expect(monthOctoberSelectors.date(false, 1)).toBeInTheDocument();

    /**
     * Date with events
     */
    const octoberDay1 = monthOctoberSelectors.date(false, 1);
    expect(octoberDay1.querySelectorAll('span').length).toEqual(1);
  });

  it('Should render plus sign', () => {
    /**
     * Events
     */
    const events = [
      {
        start: new Date('2023-09-09T11:15:00'),
        end: new Date('2023-09-09T12:15:00'),
        title: 'Event 1',
        resource: {
          color: '#7EB26D',
        },
      },
      {
        start: new Date('2023-09-09T10:15:00'),
        end: new Date('2023-09-09T11:15:00'),
        title: 'Event 1',
        resource: {
          color: '#EAB839',
        },
      },
      {
        start: new Date('2023-09-09T09:15:00'),
        end: new Date('2023-09-09T10:15:00'),
        title: 'Event 1',
        resource: {
          color: '#EAB839',
        },
      },
      {
        start: new Date('2023-09-09T08:15:00'),
        end: new Date('2023-09-09T09:15:00'),
        title: 'Event 1',
        resource: {
          color: '#EAB839',
        },
      },
    ];
    render(getComponent({ events }));

    expect(selectors.root()).toBeInTheDocument();

    const month = selectors.month(false, 8);
    expect(month).toBeInTheDocument();

    const monthSelectors = getSelectors(within(month));

    expect(monthSelectors.date(false, 9)).toBeInTheDocument();

    /**
     * Date with events
     */
    const dateWithEvents = monthSelectors.date(false, 9);

    /**
     * Dots
     */
    const spans = dateWithEvents.querySelectorAll('span');

    /**
     * Should be 2 span elements
     */
    expect(spans.length).toBeGreaterThan(0);
    expect(spans.length).toBe(3);

    /**
     * Should be + sign
     */
    expect(spans[2]).toHaveTextContent('+');
  });

  it('Should show current day', () => {
    render(getComponent({}));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.currentDate()).toBeInTheDocument();
    expect(selectors.currentDate()).toHaveTextContent('2');
  });

  it('Should handle date click', () => {
    const onDrillDown = jest.fn();

    render(getComponent({ onDrillDown }));

    const month = selectors.month(false, 9);
    expect(month).toBeInTheDocument();

    /**
     * Click on the date
     */
    const monthSelectors = getSelectors(within(month));
    fireEvent.click(monthSelectors.date(false, 15));

    expect(onDrillDown).toHaveBeenCalledWith(new Date('2022-10-15'), 'year');
  });

  it('Should show formatted title', () => {
    expect((YearView as any).title(safeDate, { localizer })).toEqual('2022');
  });

  it('Should use first day of year', () => {
    expect((YearView as any).range(safeDate, { localizer })).toEqual([new Date('2022-01-01')]);
  });

  describe('Navigate', () => {
    it('Should navigate to prev year', () => {
      expect((YearView as any).navigate(new Date('2022-01-01'), Navigate.PREVIOUS, { localizer })).toEqual(
        new Date('2021-01-01')
      );
    });

    it('Should navigate to next year', () => {
      expect((YearView as any).navigate(new Date('2022-01-01'), Navigate.NEXT, { localizer })).toEqual(
        new Date('2023-01-01')
      );
    });

    it('Should return original date', () => {
      expect((YearView as any).navigate(new Date('2022-01-01'), Navigate.TODAY, { localizer })).toEqual(
        new Date('2022-01-01')
      );
    });
  });
});
