import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import React from 'react';
import { dayjsLocalizer } from 'react-big-calendar';

import { BigEventContent } from './BigEventContent';

describe('Big Event Content', () => {
  const localizer = dayjsLocalizer(dayjs);

  it('Should render time', () => {
    render(
      <BigEventContent
        event={{ title: '123', resource: {}, start: new Date('2020-02-02 02:00') }}
        localizer={localizer as any}
        showTime={true}
      />
    );

    expect(screen.getByText('')).toContainHTML('2:00 AM');
  });

  it('Should render title', () => {
    render(<BigEventContent event={{ title: '123', resource: {} }} localizer={localizer as any} />);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('Should render location', () => {
    render(<BigEventContent event={{ title: '123', resource: { location: 'Room' } }} localizer={localizer as any} />);

    expect(screen.getByText(': Room')).toBeInTheDocument();
  });
});
