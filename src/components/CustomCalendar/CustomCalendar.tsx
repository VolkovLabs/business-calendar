import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import React, { useEffect, useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { AnnotationEvent, getLocaleData, PanelProps } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';
import { TestIds } from '../../constants';
import { Styles } from '../../styles';
import { CalendarEvent, CalendarOptions } from '../../types';
import { alignEvents, useAnnotations, useIntervalSelection, useEventFrames, useColors, useCalendarEvents } from 'utils';
import { Day, DayDrawer } from './components';

/**
 * Day.js Plugins
 * - https://day.js.org/docs/en/plugin/iso-week
 */
dayjs.extend(isoWeek);

/**
 * Properties
 */
interface Props extends PanelProps<CalendarOptions> {}

/**
 * Custom Calendar
 */
export const CustomCalendar: React.FC<Props> = ({
  options,
  data,
  timeRange,
  timeZone,
  width,
  height,
  onChangeTimeRange,
  fieldConfig,
}) => {
  /**
   * States
   */
  const [day, setDay] = useState<dayjs.Dayjs | undefined>(undefined);
  const [event, setEvent] = useState<CalendarEvent | undefined>(undefined);

  /**
   * Day grid ref
   */
  const dayGridRef = useRef<HTMLDivElement>(null);

  /**
   * Theme
   */
  const styles = useStyles2(Styles);

  /**
   * Interval
   */
  const [selectedInterval, clearSelection, onTimeSelection] = useIntervalSelection();

  /**
   * Frames
   */
  const frames = useEventFrames(data.series, options, timeZone);

  /**
   * Auto Scroll
   */
  useEffect(() => {
    if (dayGridRef.current && options.autoScroll) {
      dayGridRef.current.scrollTo(0, dayGridRef.current.scrollHeight);
    }
  }, [options.autoScroll]);

  /**
   * Week Start
   */
  const firstDay = getLocaleData().firstDayOfWeek() === 0 ? 'week' : 'isoWeek';

  /**
   * Time Range
   */
  const from = dayjs(timeRange.from.valueOf());
  const to = dayjs(timeRange.to.valueOf());
  const startOfRangeWeek = from.startOf(firstDay);
  const endOfRangeWeek = to.endOf(firstDay);
  const numDays = endOfRangeWeek.diff(startOfRangeWeek, 'days');

  /**
   * Colors
   */
  const colors = useColors(fieldConfig);

  /**
   * Events
   */
  const events = useCalendarEvents(frames, options, colors, timeRange);

  /**
   * Annotations
   */
  const annotations = useAnnotations(timeRange);
  if (options.annotations && annotations.length) {
    annotations
      .map<CalendarEvent>(
        (annotation: AnnotationEvent) =>
          ({
            text: annotation.text ?? '',
            start: dayjs(annotation.time),
            end: annotation.timeEnd ? dayjs(annotation.timeEnd) : undefined,
            open: false,
            labels: annotation.tags,
            color: annotation.color,
          } as CalendarEvent)
      )
      .forEach((event: CalendarEvent) => events.push(event));
  }

  /**
   * Align Events
   */
  const alignedEvents = alignEvents(events, firstDay);

  return (
    <div
      className={cx(
        css`
          width: ${width}px;
          height: ${height}px;
        `,
        styles.panel
      )}
      data-testid={TestIds.panel.root}
    >
      {day && (
        <DayDrawer
          day={day}
          events={alignedEvents}
          event={event}
          setEvent={setEvent}
          onClose={() => {
            setDay(undefined);
            setEvent(undefined);
          }}
        />
      )}

      {/*
       * Apply time interval
       */}

      {selectedInterval && (
        <div className={styles.applyIntervalButton}>
          <Button
            onClick={() => {
              const [from, to] = selectedInterval;
              clearSelection();
              onChangeTimeRange({ from: from.valueOf(), to: to.valueOf() });
            }}
            data-testid={TestIds.panel.buttonApplyInterval}
          >
            Apply time range
          </Button>
        </div>
      )}

      {/*
       * Header displaying the weekdays
       */}
      <div className={styles.calendar.weekday}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.calendar.weekdayLabel}>
            {dayjs().startOf(firstDay).add(i, 'days').format('ddd')}
          </div>
        ))}
      </div>

      {/*
       * Day grid
       */}

      <div
        ref={dayGridRef}
        className={cx(
          styles.calendar.grid,
          css`
            grid-auto-rows: ${Math.max(100 / Math.ceil(numDays / 7), 20)}%;
          `
        )}
      >
        {Array.from({ length: numDays + 1 }).map((_, i) => {
          const day = dayjs(startOfRangeWeek.valueOf()).startOf('day').add(i, 'days');

          const isSelected =
            selectedInterval &&
            selectedInterval[0].valueOf() <= day.valueOf() &&
            day.valueOf() <= selectedInterval[1].valueOf();

          /**
           * Events
           */
          const events = alignedEvents[day.format('YYYY-MM-DD')] ?? [];

          return (
            <Day
              key={i}
              day={day}
              events={events}
              selected={!!isSelected}
              from={from}
              to={to}
              onSelectionChange={() => onTimeSelection(day)}
              setEvent={setEvent}
              setDay={setDay}
              quickLinks={!!options.quickLinks}
              displayTime={!!options.displayTime}
              firstDay={firstDay}
            />
          );
        })}
      </div>
    </div>
  );
};
