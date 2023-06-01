import dayjs from 'dayjs';
import React from 'react';
import { screen, render } from '@testing-library/react';
import { TestIds } from '../../constants';
import { CalendarEvent } from '../../types';
import { CalendarEntry } from './CalendarEntry';

/**
 * Calendar Entry
 */
describe('Calendar Entry', () => {
  it('Should find component', async () => {
    const getComponent = ({ ...restProps }: any) => {
      return <CalendarEntry {...restProps} />;
    };

    const event: CalendarEvent = {
      start: dayjs(Date.now()),
      end: dayjs(Date.now()),
      text: 'Test',
      labels: [],
      color: '',
    };

    render(getComponent({ day: dayjs(Date.now()), event }));

    expect(screen.getByTestId(TestIds.calendarEntry.event)).toBeInTheDocument();
  });
});
