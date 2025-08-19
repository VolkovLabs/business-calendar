import { Global } from '@emotion/react';
import { AbsoluteTimeRange, PanelProps } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Alert, Drawer, useStyles2, useTheme2 } from '@grafana/ui';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Components, Event } from 'react-big-calendar';
import { useTranslation } from 'react-i18next';

import { TEST_IDS } from '../../constants';
import { useBigCalendarEvents, useCalendarRange, useLocalizer, useMessagesUpdate } from '../../hooks';
import { CalendarEvent, CalendarOptions, View } from '../../types';
import { checkIfNodeType, getLanguage, returnCalendarEvent } from '../../utils';
import { BigEventContent } from '../BigEventContent';
import { BigToolbar } from '../BigToolbar';
import { EventDetails } from '../EventDetails';
import { YearView } from '../YearView';
import { getBigCalendarStyles, getLibStyles } from './BigCalendar.styles';

/**
 * Properties
 */
interface Props
  extends Pick<PanelProps<CalendarOptions>, 'height' | 'timeRange' | 'onChangeTimeRange' | 'options' | 'timeZone'> {
  /**
   * Events
   *
   * @type {CalendarEvent[]}
   */
  events: CalendarEvent[];
}

/**
 * Big Calendar
 * @param props
 */
export const BigCalendar: React.FC<Props> = ({ height, events, timeRange, onChangeTimeRange, options, timeZone }) => {
  /**
   * Styles and Theme
   */
  const theme = useTheme2();
  const styles = useStyles2(getBigCalendarStyles);
  const libStyles = getLibStyles();

  /**
   * Translation
   */
  const { t } = useTranslation();

  /**
   * Localizer
   */
  const { localizer, messages: localizeMessages } = useLocalizer(options);

  /**
   * Update messages
   */
  const { messages } = useMessagesUpdate({ messages: localizeMessages });

  /**
   * Adopted Events for BigCalendar
   */
  const calendarEvents = useBigCalendarEvents(events);

  /**
   * Get props for event div element
   */
  const eventPropGetter = useCallback(
    (event: Event) => ({
      style: {
        backgroundColor: event.resource.color,
        color: event.resource.color
          ? theme.colors.emphasize(theme.visualization.getColorByName(event.resource.color), 1)
          : '',
      },
    }),
    [theme.colors, theme.visualization]
  );

  /**
   * Calendar Components
   */
  const components: Components = useMemo(
    () => ({
      toolbar: BigToolbar,
      agenda: {
        event: (props) => <BigEventContent {...props} localizer={localizer} isAgenda options={options} />,
      },
      day: {
        event: (props) => <BigEventContent {...props} localizer={localizer} options={options} />,
      },
      week: {
        event: (props) => <BigEventContent {...props} localizer={localizer} options={options} />,
      },
      month: {
        event: (props) => <BigEventContent {...props} localizer={localizer} isMonth options={options} />,
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      work_week: {
        event: (props) => <BigEventContent {...props} localizer={localizer} options={options} />,
      },
    }),
    [localizer, options]
  );

  /**
   * On Change Time Range
   * Keep refresh with absolute time range
   * https://github.com/grafana/grafana/issues/3192
   */
  const onChangeTimeRangeWithRefresh = useCallback(
    (timeRange: AbsoluteTimeRange) => {
      const search = locationService.getSearchObject();

      onChangeTimeRange(timeRange);

      /**
       * Enable refresh with timeout
       * To separate change time range and set refresh actions
       */
      if (search.refresh) {
        setTimeout(() => {
          locationService.partial(
            {
              refresh: search.refresh,
            },
            true
          );
        });
      }
    },
    [onChangeTimeRange]
  );

  /**
   * Manage calendar time range and view
   */
  const { date, view, onChangeView, onNavigate } = useCalendarRange(
    timeRange,
    onChangeTimeRangeWithRefresh,
    options.defaultView,
    timeZone
  );

  /**
   * Is Selected View Exist
   */
  const isViewExist = options.views?.some((item) => item === view);

  /**
   * Deselect unavailable view
   */
  useEffect(() => {
    if (!isViewExist) {
      const firstAvailableView = options?.views?.[0];
      if (firstAvailableView) {
        onChangeView(firstAvailableView);
      }
    }
  }, [isViewExist, onChangeView, options?.views]);

  /**
   * Event to show details
   */
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);

  /**
   * Select event
   */
  const onSelectEvent = useCallback(
    (event: Event, e: React.SyntheticEvent<HTMLElement>) => {
      /**
       * Prevent quick actions if clicked on link
       * stopPropagation can't be used because of reloading dashboard by data link click
       */
      if (checkIfNodeType(e.nativeEvent.target as Node, 'a')) {
        return;
      }

      if (options.quickLinks) {
        /**
         * Open first link
         */
        const link = event.resource.links?.[0];
        if (link) {
          window.open(link.href, link.target || '_self');
          return;
        }
      }

      /**
       * Show event details
       */
      setActiveEvent(returnCalendarEvent(event));
    },
    [options.quickLinks]
  );

  /**
   * Views
   */
  const views = useMemo(() => {
    return (
      options.views?.reduce(
        (acc, view) => ({
          ...acc,
          [view]: view === View.YEAR ? YearView : true,
        }),
        {}
      ) || {}
    );
  }, [options.views]);

  /**
   * Scroll To Time Date
   */
  const scrollToTime = useMemo(() => {
    if (!options.scrollToTime) {
      return;
    }

    const date = new Date();
    date.setHours(options.scrollToTime.hours);
    date.setMinutes(options.scrollToTime.minutes);

    return date;
  }, [options.scrollToTime]);

  if (!isViewExist) {
    return (
      <Alert title={t('panel.noViewsTitle')} severity="info" data-testid={TEST_IDS.bigCalendar.noViewsMessage}>
        {t('panel.noViewsMessage')}
      </Alert>
    );
  }

  return (
    <div data-testid={TEST_IDS.bigCalendar.root}>
      {activeEvent && (
        <Drawer title={t('eventDetailsDrawer.title')} onClose={() => setActiveEvent(null)}>
          <EventDetails
            event={activeEvent}
            fields={options.displayFields}
            locationLabel={options.locationLabel}
            preformattedDescription={options.preformattedDescription}
            isForTooltip={false}
          />
        </Drawer>
      )}
      <Global styles={libStyles.global} />
      <Global styles={styles.global} />
      <Calendar
        culture={getLanguage(options?.dateFormat)}
        key={height + (options.textSize ?? 0)}
        dayLayoutAlgorithm="no-overlap"
        localizer={localizer}
        messages={messages}
        events={calendarEvents}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        style={{ height }}
        views={views}
        components={components}
        onNavigate={onNavigate as never}
        onView={onChangeView as never}
        date={date}
        view={view as never}
        onSelectEvent={onSelectEvent}
        scrollToTime={scrollToTime}
        // Set length days for agenda view. 30 days by default which is not correct due to different months length
        length={dayjs(date).daysInMonth() - 1}
      />
    </div>
  );
};
