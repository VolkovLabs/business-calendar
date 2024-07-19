import { fireEvent, render, screen } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import dayjs from 'dayjs';
import React from 'react';
import { dayjsLocalizer } from 'react-big-calendar';
import { EventField } from 'types';

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
    resource: { location: 'Room', labels: ['111', '222'] },
  };

  /**
   * Default Options
   */
  const defaultOptions = {
    event: defaultEvent,
    localizer: localizer as any,
    options: {
      displayFields: [
        EventField.DESCRIPTION,
        EventField.LABELS,
        EventField.LINKS,
        EventField.LOCATION,
        EventField.TEXT,
        EventField.TIME,
      ],
      locationLabel: 'Location',
      showEventTooltip: true,
    },
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

  it('Should render Month view and tooltip on hover', () => {
    render(
      getComponent({
        ...defaultOptions,
        isMonth: true,
      })
    );

    /**
     * Check event
     */
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(selectors.month(true)).toBeInTheDocument();

    /**
     * Hover on element
     */
    fireEvent.mouseEnter(selectors.month());

    /**
     * Check labels on Tooltip
     */
    expect(screen.getByText('111')).toBeInTheDocument();
    expect(screen.getByText('222')).toBeInTheDocument();
  });

  it('Should not show tooltip if disabled via options', () => {
    const options = {
      ...defaultOptions,
      options: {
        ...defaultOptions.options,
        showEventTooltip: false,
      },
    };

    render(
      getComponent({
        ...options,
        isMonth: true,
      })
    );

    /**
     * Check event
     */
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(selectors.month(true)).toBeInTheDocument();

    /**
     * Hover on element
     */
    fireEvent.mouseEnter(selectors.month());

    /**
     * Check labels on Tooltip
     */
    expect(screen.queryByText('111')).not.toBeInTheDocument();
    expect(screen.queryByText('222')).not.toBeInTheDocument();
  });

  it('Should render Month view with font size', () => {
    render(
      getComponent({
        ...defaultOptions,
        isMonth: true,
        options: { ...defaultOptions.options, textSize: 24 },
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

  it('Should render Agenda view with font size', () => {
    render(
      getComponent({
        ...defaultOptions,
        isAgenda: true,
        options: { ...defaultOptions.options, textSize: 24 },
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
