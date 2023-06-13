import React from 'react';
import { render, screen } from '@testing-library/react';
import { CalendarPanel } from './CalendarPanel';

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof CalendarPanel>;

/**
 * Panel
 */
describe('Panel', () => {
  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props> = {}) => {
    return <CalendarPanel {...(props as any)} />;
  };
  it('Should find component', () => {
    render(getComponent());

    expect(screen).toHaveTextContent('');
  });
});
