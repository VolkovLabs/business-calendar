import { cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AutoSizer from 'react-virtualized-auto-sizer';

import { TEST_IDS } from '../../constants';
import { CalendarEvent } from '../../types';
import { LegacyCalendarEntry } from '../LegacyCalendarEntry';
import { getStyles } from './LegacyDay.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Day
   */
  day: dayjs.Dayjs;

  /**
   * Events
   */
  events: CalendarEvent[];

  /**
   * Selected
   */
  selected: boolean;

  /**
   * On Selection Change
   */
  onSelectionChange: (selected: boolean) => void;

  /**
   * From
   */
  from: dayjs.Dayjs;

  /**
   * To
   */
  to: dayjs.Dayjs;

  /**
   * Set Day
   */
  setDay: (day: dayjs.Dayjs) => void;

  /**
   * Set Event
   */
  setEvent: (event: CalendarEvent) => void;

  /**
   * Quick Links
   */
  quickLinks: boolean;

  /**
   * Display Time
   */
  displayTime: boolean;

  /**
   * First Day
   */
  firstDay: string;
}

/**
 * Day
 */
export const LegacyDay: React.FC<Props> = ({
  day,
  events,
  selected,
  onSelectionChange,
  from,
  to,
  setDay,
  setEvent,
  quickLinks,
  displayTime,
  firstDay,
}) => {
  /**
   * Styles
   */
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  /**
   * Translation
   */
  const { t } = useTranslation();

  /**
   * Day
   */
  const isToday = day.isSame(dayjs().startOf('day'));
  const isOutsideInterval = day.isBefore(from.startOf('day')) || day.isAfter(to.startOf('day'));

  /**
   * Entries
   */
  const entries = events.map((event, i) => (
    <LegacyCalendarEntry
      key={i}
      event={event}
      day={day}
      outsideInterval={isOutsideInterval}
      onClick={() => {
        setDay(day);
        setEvent(event);
      }}
      quickLinks={quickLinks}
      displayTime={displayTime}
      firstDay={firstDay}
    />
  ));

  return (
    <div
      className={cx(styles.background, isOutsideInterval && styles.backgroundOutside)}
      onClick={() => {
        onSelectionChange(!selected);
      }}
      data-testid={TEST_IDS.day.root}
    >
      <div className={cx(styles.header)}>
        <div
          className={cx(
            styles.text,
            isOutsideInterval && styles.outside,
            isToday && styles.today,
            selected && styles.selected
          )}
          data-testid={TEST_IDS.day.dayDate}
        >
          {day.format('D') === '1' ? day.format('MMM D') : day.format('D')}
        </div>
      </div>

      <AutoSizer disableWidth>
        {({ height }) => {
          const heightPerEntry = theme.typography.fontSize + 6;
          if (!height) {
            height = 0;
          }

          const maxNumEvents = Math.max(Math.floor((height - 3 * heightPerEntry) / heightPerEntry), 0);
          const moreEvents = entries.length - maxNumEvents;

          return (
            <>
              {entries.slice(0, maxNumEvents)}
              {moreEvents > 0 && (
                <div onClick={() => setDay(day)} className={styles.moreLabel} data-testid={TEST_IDS.day.buttonShowMore}>
                  {t('legacyCalendar.showMore', { count: moreEvents })}
                </div>
              )}
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};
