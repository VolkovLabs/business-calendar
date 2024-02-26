import { fireEvent, render, screen, within } from '@testing-library/react';
import { getJestSelectors } from '@volkovlabs/jest-selectors';
import dayjs from 'dayjs';
import React from 'react';
import { dayjsLocalizer, Navigate } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { YearView } from './YearView';

/**
 * Component Props
 */
type Props = React.ComponentProps<typeof YearView>;

describe('Year View', () => {
  /**
   * Localizer
   */
  const localizer = dayjsLocalizer(dayjs);

  /**
   * Set Year View Formats
   */
  (localizer.formats as any).yearHeaderFormat = 'YYYY';
  (localizer.formats as any).yearMonthFormat = 'MMMM';
  (localizer.formats as any).yearWeekFormat = 'dd';
  (localizer.formats as any).yearDateFormat = 'D';

  /**
   * Mock Format
   */
  localizer.format = jest.fn((date, format) => {
    return dayjs(date).format((localizer.formats as any)[format]);
  });

  /**
   * Safe Date
   */
  const safeDate = new Date('2022-02-02');

  /**
   * Get Tested Component
   * @param restProps
   */
  const getComponent = ({ ...restProps }: Partial<Props>) => {
    return <YearView localizer={localizer} date={safeDate} getNow={() => safeDate} {...(restProps as any)} />;
  };

  /**
   * Selectors
   */
  const getSelectors = getJestSelectors(TEST_IDS.yearView);
  const selectors = getSelectors(screen);

  it('Should render year view with all months', () => {
    render(getComponent({}));

    expect(selectors.root()).toBeInTheDocument();

    for (let i = 0; i < 12; i += 1) {
      expect(selectors.month(false, i)).toBeInTheDocument();
    }
  });

  it('Should render prev and next days', () => {
    render(getComponent({}));

    expect(selectors.root()).toBeInTheDocument();

    const month = selectors.month(false, 9);
    expect(month).toBeInTheDocument();

    const monthSelectors = getSelectors(within(month));
    expect(monthSelectors.prevDate(false, 8, 27)).toBeInTheDocument();
    expect(monthSelectors.nextDate(false, 10, 5)).toBeInTheDocument();
  });

  it('Should show current day', () => {
    render(getComponent({}));

    expect(selectors.root()).toBeInTheDocument();
    expect(selectors.currentDate()).toBeInTheDocument();
    expect(selectors.currentDate()).toHaveTextContent('2');
  });

  it('Should handle date click', () => {
    const onDrillDown = jest.fn();

    render(getComponent({ onDrillDown }));

    const month = selectors.month(false, 9);
    expect(month).toBeInTheDocument();

    /**
     * Click on the date
     */
    const monthSelectors = getSelectors(within(month));
    fireEvent.click(monthSelectors.date(false, 15));

    expect(onDrillDown).toHaveBeenCalledWith(new Date('2022-10-15'), 'year');
  });

  it('Should show formatted title', () => {
    expect((YearView as any).title(safeDate, { localizer })).toEqual('2022');
  });

  it('Should use first day of year', () => {
    expect((YearView as any).range(safeDate, { localizer })).toEqual([new Date('2022-01-01')]);
  });

  describe('Navigate', () => {
    it('Should navigate to prev year', () => {
      expect((YearView as any).navigate(new Date('2022-01-01'), Navigate.PREVIOUS, { localizer })).toEqual(
        new Date('2021-01-01')
      );
    });

    it('Should navigate to next year', () => {
      expect((YearView as any).navigate(new Date('2022-01-01'), Navigate.NEXT, { localizer })).toEqual(
        new Date('2023-01-01')
      );
    });

    it('Should return original date', () => {
      expect((YearView as any).navigate(new Date('2022-01-01'), Navigate.TODAY, { localizer })).toEqual(
        new Date('2022-01-01')
      );
    });
  });
});
