import dayjs from 'dayjs';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
import { Day } from './Day';

/**
 * Day
 */
describe('Day', () => {
  it('Should find component', async () => {
    const getComponent = ({ ...restProps }: any) => {
      return <Day {...restProps} />;
    };

    render(getComponent({ day: dayjs(Date.now()), from: dayjs(Date.now()), to: dayjs(Date.now()), events: [] }));

    expect(screen.getByTestId(TestIds.day.root)).toBeInTheDocument();
  });
});
