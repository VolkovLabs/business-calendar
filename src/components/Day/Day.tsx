import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { CalendarEvent } from '../../types';
import { CalendarEntry } from '../CalendarEntry';

/**
 * Day.js Plugins
 * - https://day.js.org/docs/en/plugin/iso-week
 */
dayjs.extend(isoWeek);

/**
 * Properties
 */
interface Props {
  day: dayjs.Dayjs;
  events: Array<CalendarEvent | undefined>;
  selected: boolean;
  onSelectionChange: (selected: boolean) => void;
  from: dayjs.Dayjs;
  to: dayjs.Dayjs;
  setDay: any;
  setEvent: any;
  quickLinks: boolean;
}

/**
 * Day
 */
export const Day = ({ day, events, selected, onSelectionChange, from, to, setDay, setEvent, quickLinks }: Props) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const isWeekend = day.isoWeekday() > 5;
  const isToday = day.isSame(dayjs().startOf('day'));

  /**
   * Since the calendar always displays full weeks, the day may be
   * rendered even if it's outside of the selected time interval.
   */
  const isOutsideInterval = day.isBefore(from.startOf('day')) || day.isAfter(to.startOf('day'));

  /**
   * Entries
   */
  const entries = events.map((event, i) => (
    <CalendarEntry
      key={i}
      event={event}
      day={day}
      outsideInterval={isOutsideInterval}
      onClick={() => {
        setDay(day);
        setEvent(event);
      }}
      quickLinks={quickLinks}
    />
  ));

  return (
    <div
      className={cx(
        styles.day,
        { [styles.weekend]: isWeekend },
        { [styles.today]: isToday },
        { [styles.selected]: selected },
        { [styles.outsideInterval]: isOutsideInterval }
      )}
      onClick={(e) => {
        onSelectionChange(!selected);
      }}
    >
      <div className={cx(styles.dayHeader)}>
        <div
          className={cx(
            styles.dayStyle,
            {
              [css`
                color: ${theme.v1.colors.textWeak};
              `]: isWeekend,
            },
            {
              [css`
                color: ${theme.v1.colors.textFaint};
              `]: isOutsideInterval,
            },
            {
              [css`
                background: ${theme.colors.primary.main};
                color: ${theme.colors.background.primary};
              `]: isToday,
            },
            {
              [css`
                background: ${theme.colors.secondary.main};
              `]: selected,
            }
          )}
        >
          {day.format('D') === '1' ? day.format('MMM D') : day.format('D')}
        </div>
      </div>

      <AutoSizer disableWidth>
        {({ height }) => {
          const heightPerEntry = 17;
          const maxNumEvents = Math.max(Math.floor((height - 3 * heightPerEntry) / heightPerEntry), 0);
          const moreEvents = entries.length - maxNumEvents;

          return (
            <>
              {entries.filter((_, i) => i < maxNumEvents)}
              {moreEvents > 0 && (
                <div onClick={() => setDay(day)} className={styles.moreEntriesLabel}>{`${moreEvents} more`}</div>
              )}
            </>
          );
        }}
      </AutoSizer>
    </div>
  );
};
