import { shallow } from 'enzyme';
import React from 'react';
import { toDataFrame } from '@grafana/data';
import { CalendarPanel } from './CalendarPanel';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
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
        <CalendarPanel data={data} {...restProps} options={options} timeRange={{ from: Date.now(), to: Date.now() }} />
      );
    };

    const wrapper = shallow(getComponent({}));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
