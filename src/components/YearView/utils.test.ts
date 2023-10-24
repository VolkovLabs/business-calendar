import { getMonth } from './utils';

describe('Year View Utils', () => {
  /**
   * October 1st is Monday
   */
  const safeDate = new Date('10-18-2023');

  describe('getMonth', () => {
    it('Should get correct weeks if monday is first day of week', () => {
      const localizer = {
        startOfWeek: () => 1,
      };

      const month = getMonth(safeDate, localizer as any);

      expect(month.weeks).toHaveLength(6);

      /**
       * First week
       */
      expect(month.weeks[0].week).toEqual([
        new Date('09-25-2023'),
        new Date('09-26-2023'),
        new Date('09-27-2023'),
        new Date('09-28-2023'),
        new Date('09-29-2023'),
        new Date('09-30-2023'),
        new Date('10-01-2023'),
      ]);

      /**
       * Last Week
       */
      expect(month.weeks[month.weeks.length - 1].week).toEqual([
        new Date('10-30-2023'),
        new Date('10-31-2023'),
        new Date('11-01-2023'),
        new Date('11-02-2023'),
        new Date('11-03-2023'),
        new Date('11-04-2023'),
        new Date('11-05-2023'),
      ]);
    });

    it('Should get correct weeks if sunday is first day of week', () => {
      const localizer = {
        startOfWeek: () => 0,
      };

      const month = getMonth(safeDate, localizer as any);

      expect(month.weeks).toHaveLength(5);

      /**
       * First week
       */
      expect(month.weeks[0].week).toEqual([
        new Date('10-01-2023'),
        new Date('10-02-2023'),
        new Date('10-03-2023'),
        new Date('10-04-2023'),
        new Date('10-05-2023'),
        new Date('10-06-2023'),
        new Date('10-07-2023'),
      ]);

      /**
       * Last Week
       */
      expect(month.weeks[month.weeks.length - 1].week).toEqual([
        new Date('10-29-2023'),
        new Date('10-30-2023'),
        new Date('10-31-2023'),
        new Date('11-01-2023'),
        new Date('11-02-2023'),
        new Date('11-03-2023'),
        new Date('11-04-2023'),
      ]);
    });

    /**
     * Excluded until supporting of saturday as a first day of week
     */
    xit('Should get correct weeks if saturday is first day of week', () => {
      const localizer = {
        startOfWeek: () => 6,
      };

      const month = getMonth(safeDate, localizer as any);

      expect(month.weeks).toHaveLength(5);

      /**
       * First week
       */
      expect(month.weeks[0].week).toEqual([
        new Date('09-30-2023'),
        new Date('10-01-2023'),
        new Date('10-02-2023'),
        new Date('10-03-2023'),
        new Date('10-04-2023'),
        new Date('10-05-2023'),
        new Date('10-06-2023'),
      ]);

      /**
       * Last Week
       */
      expect(month.weeks[month.weeks.length - 1].week).toEqual([
        new Date('10-28-2023'),
        new Date('10-29-2023'),
        new Date('10-30-2023'),
        new Date('10-31-2023'),
        new Date('11-01-2023'),
        new Date('11-02-2023'),
        new Date('11-03-2023'),
      ]);
    });
  });
});
