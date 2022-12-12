import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import React, { useRef, useState } from 'react';
import { css, cx } from '@emotion/css';
import { AnnotationEvent, classicColors, FieldType, PanelProps, textUtil } from '@grafana/data';
import { Badge, Button, Drawer, HorizontalGroup, Icon, LinkButton, useStyles2, useTheme2 } from '@grafana/ui';
import { getStyles } from '../../styles';
import { CalendarEvent, CalendarOptions } from '../../types';
import { alignEvents, formatEventInterval, toTimeField, useAnnotations, useIntervalSelection } from '../../utils';
import { CalendarEntry } from '../CalendarEntry';
import { Day } from '../Day';

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
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const annotations = useAnnotations(timeRange);

  const [selectedInterval, clearSelection, onTimeSelection] = useIntervalSelection();

  const [drawerProps, setDrawerProps] = useState<Record<string, any>>();

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
    // No default for end time. If end time dimension isn't set, we assume that all events are instants.
    end: toTimeField(frame.fields.find((f) => f.name === options.endTimeField)),
    labels: frame.fields.filter((f) => options.labelFields?.includes(f.name)),
  }));

  const ref = useRef<HTMLDivElement>(null);

  if (ref.current && options.autoScroll) {
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }

  const from = dayjs(timeRange.from.valueOf());
  const to = dayjs(timeRange.to.valueOf());
  const startOfWeek = from.startOf('isoWeek');
  const endOfWeek = to.endOf('isoWeek');
  const numDays = endOfWeek.diff(startOfWeek, 'days');

  const events = frames.flatMap((frame, frameIdx) => {
    return frame.text && frame.start
      ? Array.from({ length: frame.text.values.length })
          .map((_, i) => ({
            text: frame.text?.values.get(i),
            description: frame.description?.values.get(i),
            start: frame.start?.values.get(i),
            end: frame.end?.values.get(i),
            labels: frame.labels?.map((field) => field.values.get(i)).filter((label) => label),
            links: frame.text?.getLinks!({ valueRowIndex: i }),
          }))
          .map<CalendarEvent>(({ text, description, labels, links, start, end }, i) => ({
            text,
            description,
            labels,
            start: dayjs(start),
            color: classicColors[Math.floor(frameIdx % classicColors.length)],
            links,

            // Set undefined if the user hasn't explicitly configured the dimension
            // for end time.
            //
            // Set end time to the end of the time interval if the user configured the
            // end time dimension, but it's missing values. The panel interpretes
            // this as an open interval.
            end: frame.end ? (end ? dayjs(end) : endOfWeek) : undefined,
          }))
      : [];
  });

  /**
   * Annotations
   */
  if (options.annotations) {
    annotations
      .map<CalendarEvent>(
        (annotation: AnnotationEvent) =>
          ({
            text: annotation.text ?? '',
            start: dayjs(annotation.time),
            end: annotation.time ? dayjs(annotation.timeEnd) : undefined,
            open: false,
            color: annotation.color,
          } as CalendarEvent)
      )
      .forEach((event: CalendarEvent) => events.push(event));
  }

  /**
   * Events
   */
  const alignedEvents = alignEvents(events);

  const drawerShowDay = (day: dayjs.Dayjs, isOutsideInterval: boolean) => {
    const events = alignedEvents[day.format('YYYY-MM-DD')] ?? [];

    setDrawerProps({
      title: day.format('LL'),
      subtitle: day.format('dddd'),
      children: (
        <div>
          {events
            .filter((event) => event)
            .map((event, i) => (
              <CalendarEntry
                key={i}
                event={event}
                day={day}
                outsideInterval={isOutsideInterval}
                summary={true}
                onClick={() => {
                  if (event) {
                    drawerShowEvent(day, event, isOutsideInterval);
                  }
                }}
              />
            ))}
        </div>
      ),
    });
  };

  const drawerShowEvent = (day: dayjs.Dayjs, event: CalendarEvent, isOutsideInterval: boolean) => {
    setDrawerProps({
      title: event.text,
      subtitle: formatEventInterval(event),
      children: (
        <>
          <Button fill={'text'} onClick={() => drawerShowDay(day, isOutsideInterval)}>
            <Icon name="angle-left" />
            Back to {day.format('LL')}
          </Button>
          {!!event.labels?.length && (
            <div
              className={css`
                margin: ${theme.v1.spacing.sm} 0;
              `}
            >
              {event.labels?.map((label, i) => (
                <Badge key={i} text={label} color={'blue'} />
              ))}
            </div>
          )}
          {event.description && <p dangerouslySetInnerHTML={{ __html: textUtil.sanitize(event.description) }} />}
          <HorizontalGroup>
            {event.links?.map((link, index) => (
              <LinkButton
                key={index}
                icon={link.target === '_self' ? 'link' : 'external-link-alt'}
                href={link.href}
                target={link.target}
                variant={'secondary'}
                onClick={link.onClick}
              >
                {link.title}
              </LinkButton>
            ))}
          </HorizontalGroup>
        </>
      ),
    });
  };

  return (
    <div
      className={cx(
        css`
          width: ${width}px;
          height: ${height}px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `
      )}
    >
      {drawerProps && (
        <Drawer
          scrollableContent={true}
          inline={true}
          expandable={true}
          onClose={() => setDrawerProps(undefined)}
          {...drawerProps}
        >
          {drawerProps.children}
        </Drawer>
      )}
      {/* Apply time interval */}
      {selectedInterval && (
        <div className={styles.applyIntervalButton}>
          <Button
            onClick={() => {
              if (selectedInterval) {
                const [from, to] = selectedInterval;
                clearSelection();
                onChangeTimeRange({ from: from.valueOf(), to: to.valueOf() });
              }
            }}
          >
            Apply time range
          </Button>
        </div>
      )}

      {/* Header displaying the weekdays */}
      <div className={styles.weekdayContainer}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.weekdayLabel}>
            {dayjs().startOf('isoWeek').add(i, 'days').format('ddd')}
          </div>
        ))}
      </div>

      {/* Day grid */}
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

          // Since the calendar always displays full weeks, the day may be
          // rendered even if it's outside of the selected time interval.
          const isOutsideInterval = day.isBefore(from.startOf('day')) || day.isAfter(to.startOf('day'));

          const events = alignedEvents[day.format('YYYY-MM-DD')] ?? [];
          const entries = events.map<CalendarEvent | undefined>((event) =>
            event ? { ...event, color: event.color } : undefined
          );

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
              onShowEvent={(event) => drawerShowEvent(day, event, isOutsideInterval)}
              onShowMore={() => drawerShowDay(day, isOutsideInterval)}
              quickLinks={!!options.quickLinks}
            />
          );
        })}
      </div>
    </div>
  );
};
