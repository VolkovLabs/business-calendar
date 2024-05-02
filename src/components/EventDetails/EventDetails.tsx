import { textUtil } from '@grafana/data';
import { Card, LinkButton, TagList, useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TEST_IDS } from '../../constants';
import { CalendarEvent, EventField } from '../../types';
import { getTime, isFieldDisplay } from '../../utils';
import { getStyles } from './EventDetails.styles';

/**
 * Properties
 */
interface Props {
  /**
   * Event
   */
  event: CalendarEvent;

  /**
   * Show Full Info
   */
  showFullInfo?: boolean;

  /**
   * On Click
   */
  onClick?: (event: unknown) => void;
}

/**
 * Event Details
 * @param event
 * @param showFullInfo
 * @param onClick
 * @constructor
 */
export const EventDetails: React.FC<Props> = ({ event, showFullInfo = true, onClick }) => {
  /**
   * Styles
   */
  const styles = useStyles2(getStyles);

  /**
   * Translation
   */
  const { t } = useTranslation();

  /**
   * Meta
   */
  const meta = useMemo(() => {
    /**
     * Location text
     */
    const location =
      isFieldDisplay(EventField.LOCATION, event.fields) && event.location
        ? event.locationLabel?.trim()
          ? `${event.locationLabel}: ${event.location}`
          : t('eventDetailsDrawer.location', { location: event.location })
        : '';

    let time = '';

    if (isFieldDisplay(EventField.TIME, event.fields)) {
      time = getTime(event);
    }
    return [time, location];
  }, [event, t]);

  /**
   * Tags
   */
  const tags = useMemo(() => event.labels.flatMap((label) => label.split(',')), [event.labels]);

  return (
    <Card onClick={onClick} data-testid={TEST_IDS.eventDetails.root}>
      <Card.Heading aria-label={TEST_IDS.eventDetails.titleButton}>
        <div data-testid={TEST_IDS.eventDetails.titleText}>
          <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" fill={event.color} className={styles.svg}>
            <circle cx={5} cy={5} r={5} />
          </svg>
          {isFieldDisplay(EventField.TEXT, event.fields) && event.text}
        </div>
      </Card.Heading>
      <Card.Meta>{meta}</Card.Meta>
      {isFieldDisplay(EventField.LABELS, event.fields) && (
        <Card.Tags>
          <TagList tags={tags} className={styles.labels} />
        </Card.Tags>
      )}
      {showFullInfo && (
        <>
          {isFieldDisplay(EventField.DESCRIPTION, event.fields) && event.description && (
            <Card.Description>
              <span dangerouslySetInnerHTML={{ __html: textUtil.sanitize(event.description) }} />
            </Card.Description>
          )}
          <Card.Actions>
            {isFieldDisplay(EventField.LINKS, event.fields) &&
              event.links
                ?.filter((link) => link.href)
                .map((link, index) => (
                  <LinkButton
                    key={index}
                    icon={link.target === '_self' ? 'link' : 'external-link-alt'}
                    href={link.href}
                    target={link.target}
                    variant={'secondary'}
                    onClick={link.onClick}
                    aria-label={TEST_IDS.eventDetails.link}
                  >
                    {link.title}
                  </LinkButton>
                ))}
          </Card.Actions>
        </>
      )}
    </Card>
  );
};
