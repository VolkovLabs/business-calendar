import { shallow } from 'enzyme';
import React from 'react';
import { CalendarEntry } from './CalendarEntry';

/**
 * Calendar Entry
 */
describe('Calendar Entry', () => {
  it('Should find component', async () => {
    const getComponent = ({ ...restProps }: any) => {
      return <CalendarEntry {...restProps} />;
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
