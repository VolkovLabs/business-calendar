import React from 'react';
import { render, screen } from '@testing-library/react';
import { BigEventContent } from './BigEventContent';

describe('Big Event Content', () => {
  it('Should render title', () => {
    render(<BigEventContent event={{ title: '123' }} />);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('Should render location', () => {
    render(<BigEventContent event={{ title: '123', resource: { location: 'Room' } }} />);

    expect(screen.getByText(': Room')).toBeInTheDocument();
  });
});
