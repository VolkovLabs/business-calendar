import { textUtil } from '@grafana/data';
import { Card, LinkButton, TagList, useStyles2 } from '@grafana/ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TEST_IDS } from '../../constants';
import { CalendarEvent, EventField } from '../../types';
import { getTime, isFieldVisible } from '../../utils';
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

  /**
   * Fields
   *
   * @type {EventField[]}
   */
  fields: EventField[];

  /**
   * Fields
   *
   * @type {string}
   */
  locationLabel: string;
}

/**
 * Event Details
 */
export const EventDetails: React.FC<Props> = ({ event, showFullInfo = true, onClick, locationLabel, fields }) => {
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
      isFieldVisible(EventField.LOCATION, fields) && event.location
        ? locationLabel.trim()
          ? `${locationLabel} ${event.location}`
          : t('eventDetailsDrawer.location', { location: event.location })
        : '';

    let time = '';

    if (isFieldVisible(EventField.TIME, fields)) {
      time = getTime(event);
    }
    return [time, location];
  }, [event, fields, locationLabel, t]);

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
          {isFieldVisible(EventField.TEXT, fields) && event.text}
        </div>
      </Card.Heading>
      <Card.Meta>{meta}</Card.Meta>
      {isFieldVisible(EventField.LABELS, fields) && (
        <Card.Tags>
          <TagList tags={tags} className={styles.labels} />
        </Card.Tags>
      )}
      {showFullInfo && (
        <>
          {isFieldVisible(EventField.DESCRIPTION, fields) && event.description && (
            <Card.Description>
              <span dangerouslySetInnerHTML={{ __html: textUtil.sanitize(event.description) }} />
            </Card.Description>
          )}
          <Card.Actions>
            {isFieldVisible(EventField.LINKS, fields) &&
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
