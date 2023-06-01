import React from 'react';
import { screen, render } from '@testing-library/react';
import { TestIds } from '../../constants';
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

    render(getComponent({}));

    expect(screen.getByLabelText(TestIds.multiFieldEditor.select));
  });
});
