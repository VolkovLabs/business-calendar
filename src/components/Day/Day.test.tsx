import dayjs from 'dayjs';
import { shallow } from 'enzyme';
import React from 'react';
import { Day } from './Day';

/**
 * Day
 */
describe('Day', () => {
  it('Should find component', async () => {
    const getComponent = ({ ...restProps }: any) => {
      return <Day {...restProps} />;
    };

    const wrapper = shallow(
      getComponent({ day: dayjs(Date.now()), from: dayjs(Date.now()), to: dayjs(Date.now()), events: [] })
    );
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
