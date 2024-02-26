import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TestIds } from '../../constants';
import { BigToolbar } from './BigToolbar';

/**
 * Props
 */
type Props = React.ComponentProps<typeof BigToolbar>;

/**
 * Toolbar
 */
describe('Toolbar', () => {
  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    return <BigToolbar localizer={{ messages: {} }} {...(props as any)} />;
  };

  it('Should render navigation buttons', () => {
    const onNavigate = jest.fn();
    render(getComponent({ onNavigate }));

    /**
     * Today button
     */
    expect(screen.getByTestId(TestIds.bigCalendarToolbar.buttonToday)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TestIds.bigCalendarToolbar.buttonToday));
    expect(onNavigate).toHaveBeenCalledWith('TODAY');

    /**
     * Back Button
     */
    expect(screen.getByTestId(TestIds.bigCalendarToolbar.buttonBack)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TestIds.bigCalendarToolbar.buttonBack));
    expect(onNavigate).toHaveBeenCalledWith('PREV');

    /**
     * Next Button
     */
    expect(screen.getByTestId(TestIds.bigCalendarToolbar.buttonNext)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TestIds.bigCalendarToolbar.buttonNext));
    expect(onNavigate).toHaveBeenCalledWith('NEXT');
  });

  it('Should render view buttons', () => {
    const onView = jest.fn();
    render(getComponent({ onView, views: ['month', 'week'] }));

    expect(screen.getByTestId(TestIds.bigCalendarToolbar.buttonView('week'))).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(TestIds.bigCalendarToolbar.buttonView('week')));
    expect(onView).toHaveBeenCalledWith('week');
  });
});
