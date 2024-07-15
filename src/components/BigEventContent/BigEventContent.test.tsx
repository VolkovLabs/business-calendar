import { render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import dayjs from 'dayjs';
import React from 'react';
import { dayjsLocalizer } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { BigEventContent } from './BigEventContent';

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof BigEventContent>;

describe('Big Event Content', () => {
  const localizer = dayjsLocalizer(dayjs);

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.eventContent);
  const selectors = getSelectors(screen);

  /**
   * Default Event
   */
  const defaultEvent = {
    title: '123',
    start: new Date('2020-02-02 02:00'),
    end: new Date('2020-02-02 02:30'),
    resource: { location: 'Room' },
  };

  /**
   * Default Options
   */
  const defaultOptions = {
    event: defaultEvent,
    localizer: localizer as any,
  } as any;

  /**
   * Get Tested Component
   * @param props
   */
  const getComponent = (props: Partial<Props>) => {
    return <BigEventContent {...(props as any)} />;
  };

  it('Should render time', () => {
    render(getComponent(defaultOptions));

    expect(screen.getByText('2:00 AM')).toBeInTheDocument();
  });

  it('Should render title', () => {
    render(getComponent(defaultOptions));

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('Should render location', () => {
    render(getComponent(defaultOptions));

    expect(screen.getByText('123')).toBeInTheDocument();

    expect(screen.getByText('Room')).toBeInTheDocument();
  });

  it('Should render Month view', () => {
    render(
      getComponent({
        ...defaultOptions,
        isMonth: true,
      })
    );

    expect(screen.getByText('123')).toBeInTheDocument();
    expect(selectors.month()).toBeInTheDocument();
  });

  it('Should render Month view with font', () => {
    render(
      getComponent({
        ...defaultOptions,
        isAgenda: true,
        textSize: 24,
      })
    );

    expect(screen.getByText('123')).toBeInTheDocument();

    expect(selectors.month()).toBeInTheDocument();
    expect(selectors.month()).toHaveStyle({
      fontSize: '24px',
    });
  });

  it('Should render Agenda view', () => {
    render(
      getComponent({
        ...defaultOptions,
        isAgenda: true,
      })
    );

    expect(screen.getByText('123')).toBeInTheDocument();
    expect(selectors.agenda()).toBeInTheDocument();
  });

  it('Should render Agenda view with font', () => {
    render(
      getComponent({
        ...defaultOptions,
        isAgenda: true,
        textSize: 24,
      })
    );

    expect(screen.getByText('123')).toBeInTheDocument();

    expect(selectors.agenda()).toBeInTheDocument();
    expect(selectors.agenda()).toHaveStyle({
      fontSize: '24px',
    });
  });

  it('Should render view for duration more or equal 90 minutes', () => {
    render(
      getComponent({
        ...defaultOptions,
        event: {
          ...defaultEvent,
          end: new Date('2020-02-02 04:30'),
        },
      })
    );

    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('2:00 AM – 4:30 AM')).toBeInTheDocument();

    expect(selectors.longDuration()).toBeInTheDocument();
  });

  it('Should render view for duration more or equal 45 minutes', () => {
    render(
      getComponent({
        ...defaultOptions,
        event: {
          ...defaultEvent,
          end: new Date('2020-02-02 02:50'),
        },
      })
    );

    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('2:00 AM')).toBeInTheDocument();

    expect(selectors.averageDuration()).toBeInTheDocument();
  });

  it('Should render view if event doesn`t have end time', () => {
    render(
      getComponent({
        ...defaultOptions,
        event: {
          ...defaultEvent,
          end: new Date('2020-02-02 02:50'),
          resource: {
            noEndTime: true,
          },
        },
      })
    );

    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('2:00 AM')).toBeInTheDocument();

    expect(selectors.averageDuration(true)).not.toBeInTheDocument();
    expect(selectors.longDuration(true)).not.toBeInTheDocument();
    expect(selectors.month(true)).not.toBeInTheDocument();
    expect(selectors.agenda(true)).not.toBeInTheDocument();
  });
});
