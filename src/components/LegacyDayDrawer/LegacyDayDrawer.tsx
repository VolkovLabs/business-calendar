import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, Tab, TabsBar } from '@grafana/ui';
import { CalendarEvent } from '../../types';
import { EventDetails } from '../EventDetails';

/**
 * Day.js Plugins
 * - https://day.js.org/docs/en/plugin/localized-format
 */
dayjs.extend(localizedFormat);

/**
 * Properties
 */
interface Props {
  /**
   * Day
   */
  day: dayjs.Dayjs | undefined;

  /**
   * Aligned Events
   */
  events: Record<string, Array<CalendarEvent | undefined>>;

  /**
   * Event
   */
  event: CalendarEvent | undefined;

  /**
   * Set Event handler
   */
  setEvent: any;

  /**
   * OnClose Event handler
   */
  onClose: any;
}

/**
 * Day Drawer
 */
export const LegacyDayDrawer: React.FC<Props> = ({ day, events, event, setEvent, onClose }) => {
  /**
   * Translation
   */
  const { t } = useTranslation();

  if (!day) {
    return (
      <Drawer title={t('legacyCalendar.dayDrawer.title')} scrollableContent onClose={onClose}>
        {t('legacyCalendar.dayDrawer.noEventsMessage')}
      </Drawer>
    );
  }

  /**
   * Events
   */
  const dayEvents = events[day.format('YYYY-MM-DD')].filter((event) => event !== undefined) ?? [];

  /**
   * Return
   */
  return (
    <Drawer
      title={day.format('LL')}
      tabs={
        <TabsBar>
          <Tab
            label={t('legacyCalendar.dayDrawer.allTab')}
            active={!event}
            onChangeTab={() => setEvent(undefined)}
            counter={dayEvents.length}
          />
          {event && <Tab label={event.text} active={!!event} />}
        </TabsBar>
      }
      subtitle={day.format('dddd')}
      scrollableContent
      onClose={onClose}
    >
      {event && <EventDetails event={event} />}

      {!event && (
        <>
          {dayEvents.map((event, i) => {
            if (!event) {
              return;
            }

            return <EventDetails key={i} event={event} onClick={() => setEvent(event)} showFullInfo={false} />;
          })}
        </>
      )}
    </Drawer>
  );
};
