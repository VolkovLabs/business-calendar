import { shallow } from 'enzyme';
import React from 'react';
import { MultiFieldEditor } from './MultiFieldEditor';

/**
 * Editor
 */
describe('Editor', () => {
  it('Should find component', async () => {
    const context = {
      options: {},
    };

    const getComponent = ({ ...restProps }: any) => {
      return <MultiFieldEditor {...restProps} context={context} />;
    };

    const wrapper = shallow(getComponent({}));
    const select = wrapper.find('Select');
    expect(select.exists()).toBeTruthy();
  });
});
