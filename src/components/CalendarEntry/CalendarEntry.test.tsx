import dayjs from 'dayjs';
import { shallow } from 'enzyme';
import React from 'react';
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
    const wrapper = shallow(getComponent({ day: dayjs(Date.now()), event }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
