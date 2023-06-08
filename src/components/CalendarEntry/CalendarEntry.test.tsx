import dayjs from 'dayjs';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
import { CalendarEvent } from '../../types';
import { CalendarEntry } from './CalendarEntry';

/**
 * Calendar Entry
 */
describe('Calendar Entry', () => {
  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: any) => {
    return <CalendarEntry {...restProps} />;
  };

  /**
   * Return particular day to prevent unexpected behaviors with dates
   */
  const getSafeDate = () => new Date('2023-02-02');

  it('Should find component', () => {
    const startFromDay = dayjs(getSafeDate()).startOf('day');
    const event: CalendarEvent = {
      start: startFromDay,
      end: dayjs(new Date('2023-02-02')),
      text: 'Test',
      labels: [],
      color: '',
    };

    render(getComponent({ day: startFromDay, event }));

    expect(screen.getByTestId(TestIds.calendarEntry.eventOneDay)).toBeInTheDocument();
  });

  it('Should show filler if no event', () => {
    render(getComponent({ day: dayjs(Date.now()), event: null }));

    expect(screen.getByTestId(TestIds.calendarEntry.filler)).toBeInTheDocument();
  });

  describe('One day event', () => {
    it('Should show event without time if not specified', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day');
      const event: CalendarEvent = {
        start: startFromDay,
        end: dayjs(new Date('2023-02-02')),
        text: 'Test',
        labels: [],
        color: '',
      };

      render(getComponent({ day: startFromDay, event, displayTime: false, firstDay: startFromDay }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventOneDayWithoutTime)).toBeInTheDocument();
    });

    it('Should show event with time if specified', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day');
      const event: CalendarEvent = {
        start: startFromDay,
        end: dayjs(getSafeDate()),
        text: 'Test',
        labels: [],
        color: '',
      };

      render(getComponent({ day: startFromDay, event, displayTime: true, firstDay: startFromDay }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventOneDayWithTime)).toBeInTheDocument();
    });

    it('Should show event if end is not speficied', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day');
      const event: CalendarEvent = {
        start: startFromDay,
        text: 'Test',
        labels: [],
        color: '',
      };

      render(getComponent({ day: startFromDay, event, displayTime: true, firstDay: startFromDay }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventOneDayWithTime)).toBeInTheDocument();
    });

    it('Should render link', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day');
      const linkUrl = 'abc';
      const event: CalendarEvent = {
        start: startFromDay,
        end: dayjs(getSafeDate()),
        text: 'Test',
        labels: [],
        color: '',
        links: [
          {
            href: linkUrl,
            target: '_blank',
            title: '',
            origin: '' as any,
          },
        ],
      };

      render(getComponent({ day: startFromDay, event, firstDay: startFromDay, quickLinks: true }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventOneDay)).toHaveAttribute('href', linkUrl);
    });
  });

  describe('Few days event', () => {
    it('Should show event without time if not specified', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day');
      const endFromDay = dayjs(getSafeDate()).startOf('day').add(1, 'day');
      const event: CalendarEvent = {
        start: startFromDay,
        end: endFromDay,
        text: 'Test',
        labels: [],
        color: '',
      };

      render(getComponent({ day: startFromDay, event, displayTime: false, firstDay: startFromDay }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventFewDaysWithoutTime)).toBeInTheDocument();
    });

    it('Should show event with time if specified', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day');
      const endFromDay = dayjs(getSafeDate()).startOf('day').add(1, 'day');
      const event: CalendarEvent = {
        start: startFromDay,
        end: endFromDay,
        text: 'Test',
        labels: [],
        color: '',
      };

      render(getComponent({ day: startFromDay, event, displayTime: true, firstDay: startFromDay }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventFewDaysWithTime)).toBeInTheDocument();
    });

    it('Should show event that is not started today', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day').subtract(1, 'week');
      const endFromDay = dayjs(getSafeDate()).startOf('day').add(1, 'day');
      const event: CalendarEvent = {
        start: startFromDay,
        end: endFromDay,
        text: 'Test',
        labels: [],
        color: '',
      };

      render(getComponent({ day: dayjs(getSafeDate()), event, displayTime: true, firstDay: startFromDay }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventFewDaysNotStartedToday)).toBeInTheDocument();
    });

    it('Should show event if end is falsy', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day');
      const event: CalendarEvent = {
        start: startFromDay,
        end: false as any,
        text: 'Test',
        labels: [],
        color: '',
      };

      render(getComponent({ day: startFromDay, event, displayTime: true, firstDay: startFromDay }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventFewDaysWithTime)).toBeInTheDocument();
    });

    it('Should render link', () => {
      const startFromDay = dayjs(getSafeDate()).startOf('day').subtract(1, 'week');
      const endFromDay = dayjs(getSafeDate()).startOf('day').add(1, 'day');
      const linkUrl = 'abc';
      const event: CalendarEvent = {
        start: startFromDay,
        end: endFromDay,
        text: 'Test',
        labels: [],
        color: '',
        links: [
          {
            href: linkUrl,
            target: '_blank',
            title: '',
            origin: '' as any,
          },
        ],
      };

      render(getComponent({ day: dayjs(getSafeDate()), event, firstDay: startFromDay, quickLinks: true }));

      expect(screen.getByTestId(TestIds.calendarEntry.eventFewDays)).toHaveAttribute('href', linkUrl);
    });
  });
});
