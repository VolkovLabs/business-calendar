import dayjs from 'dayjs';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from '../../constants';
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
    const day = dayjs();

    render(
      getComponent({
        data,
        day,
        events: {
          [day.format('YYYY-MM-DD')]: [],
        },
      })
    );

    expect(screen.getByLabelText(TestIds.dayDrawer.root(day.format('LL')))).toBeInTheDocument();
  });
});
