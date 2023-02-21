import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import React, { useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { AnnotationEvent, classicColors, FieldType, PanelProps } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { CalendarEvent, CalendarOptions } from '../../types';
import { alignEvents, toTimeField, useAnnotations, useIntervalSelection } from '../../utils';
import { Day } from '../Day';
import { DayDrawer } from '../DayDrawer';

/**
 * Day.js Plugins
 * - https://day.js.org/docs/en/plugin/iso-week
 * - https://day.js.org/docs/en/plugin/utc
 */
dayjs.extend(isoWeek);
dayjs.extend(utc);

/**
 * Properties
 */
interface Props extends PanelProps<CalendarOptions> {}

/**
 * Calendar Panel
 */
export const CalendarPanel: React.FC<Props> = ({ options, data, timeRange, width, height, onChangeTimeRange }) => {
  /**
   * States
   */
  const [day, setDay] = useState<dayjs.Dayjs | undefined>(undefined);
  const [event, setEvent] = useState<CalendarEvent | undefined>(undefined);

  /**
   * Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * Interval
   */
  const [selectedInterval, clearSelection, onTimeSelection] = useIntervalSelection();

  /**
   * Frames
   */
  const frames = data.series.map((frame) => ({
    text: options.textField
      ? frame.fields.find((f) => f.name === options.textField)
      : frame.fields.find((f) => f.type === FieldType.string),
    description: frame.fields.find((f) => f.name === options.descriptionField),
    start: toTimeField(
      options.timeField
        ? frame.fields.find((f) => f.name === options.timeField)
        : frame.fields.find((f) => f.type === FieldType.time)
    ),
    end: toTimeField(frame.fields.find((f) => f.name === options.endTimeField)),
    labels: frame.fields.filter((f) => options.labelFields?.includes(f.name)),
    color: frame.fields.find((f) => f.name === options.colorField),
  }));

  /**
   * Auto Scroll
   */
  const ref = useRef<HTMLDivElement>(null);
  if (ref.current && options.autoScroll) {
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }

  /**
   * Time Range
   */
  const from = dayjs(timeRange.from.valueOf());
  const to = dayjs(timeRange.to.valueOf());
  const startOfWeek = from.startOf('isoWeek');
  const endOfWeek = to.endOf('isoWeek');
  const numDays = endOfWeek.diff(startOfWeek, 'days');

  /**
   * Events
   */
  const events = frames.flatMap((frame, frameIdx) => {
    const colorFn = frame.color?.display;

    if (!frame.text || !frame.start) {
      return [];
    }

    return Array.from({ length: frame.text.values.length })
      .map((_, i) => ({
        text: frame.text?.values.get(i),
        description: frame.description?.values.get(i),
        start: frame.start?.values.get(i),
        end: frame.end?.values.get(i),
        labels: frame.labels?.map((field) => field.values.get(i)).filter((label) => label),
        links: frame.text?.getLinks!({ valueRowIndex: i }),
        color: frame.color?.values.get(i),
      }))
      .map<CalendarEvent>(({ text, description, labels, links, start, end, color }, i) => ({
        text,
        description,
        labels,
        start: dayjs(start),
        color: colorFn?.(color).color ?? classicColors[Math.floor(frameIdx % classicColors.length)],
        links,
        end: frame.end ? (end ? dayjs(end) : endOfWeek) : undefined,
      }));
  });

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
            color: annotation.color,
          } as CalendarEvent)
      )
      .forEach((event: CalendarEvent) => events.push(event));
  }

  /**
   * Align Events
   */
  const alignedEvents = alignEvents(events);

  return (
    <div
      className={cx(
        css`
          width: ${width}px;
          height: ${height}px;
        `,
        styles.panel
      )}
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
          >
            Apply time range
          </Button>
        </div>
      )}

      {/*
       * Header displaying the weekdays
       */}

      <div className={styles.weekdayContainer}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.weekdayLabel}>
            {dayjs().startOf('isoWeek').add(i, 'days').format('ddd')}
          </div>
        ))}
      </div>

      {/*
       * Day grid
       */}

      <div
        ref={ref}
        className={cx(
          styles.calendarContainer,
          css`
            grid-auto-rows: ${Math.max(100 / Math.ceil(numDays / 7), 20)}%;
          `
        )}
      >
        {Array.from({ length: numDays + 1 }).map((_, i) => {
          const day = dayjs(startOfWeek.valueOf()).startOf('day').add(i, 'days');

          const isWeekend = day.isoWeekday() > 5;
          const isToday = day.isSame(dayjs().startOf('day'));
          const isSelected =
            selectedInterval &&
            selectedInterval[0].valueOf() <= day.valueOf() &&
            day.valueOf() <= selectedInterval[1].valueOf();

          /**
           * Since the calendar always displays full weeks, the day may be
           * rendered even if it's outside of the selected time interval.
           */
          const isOutsideInterval = day.isBefore(from.startOf('day')) || day.isAfter(to.startOf('day'));

          /**
           * Events
           */
          const events = alignedEvents[day.format('YYYY-MM-DD')] ?? [];

          /**
           * Entries
           */
          const entries = events
            .map<CalendarEvent | undefined>((event) => (event ? { ...event, color: event.color } : undefined))
            .filter((i) => i !== undefined);

          return (
            <Day
              key={i}
              day={day}
              weekend={isWeekend}
              today={isToday}
              events={entries}
              selected={!!isSelected}
              onSelectionChange={() => onTimeSelection(day)}
              outsideInterval={isOutsideInterval}
              from={startOfWeek}
              to={endOfWeek}
              onShowEvent={(event) => {
                setDay(day);
                setEvent(event);
              }}
              onShowMore={() => setDay(day)}
              quickLinks={!!options.quickLinks}
            />
          );
        })}
      </div>
    </div>
  );
};
