import { shallow } from 'enzyme';
import React from 'react';
import { DayDrawer } from './DayDrawer';

/**
 * Day Drawer
 */
describe('DayDrawer', () => {
  const data = {};

  it('Should find component', async () => {
    const getComponent = ({ options = {}, ...restProps }: any) => {
      return <DayDrawer {...restProps} onClose={() => {}} />;
    };

    const wrapper = shallow(getComponent({ data }));
    const div = wrapper.find('Drawer');
    expect(div.exists()).toBeTruthy();
  });
});
