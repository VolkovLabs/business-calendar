import { Button, ButtonGroup, useStyles2 } from '@grafana/ui';
import React from 'react';
import { Messages, Navigate, ToolbarProps } from 'react-big-calendar';

import { TEST_IDS } from '../../constants';
import { getStyles } from './BigToolbar.styles';

/**
 * Properties
 */
type Props = ToolbarProps;

/**
 * Toolbar for Big Calendar
 * @constructor
 */
export const BigToolbar: React.FC<Props> = ({ localizer: { messages }, label, onNavigate, views, view, onView }) => {
  /**
   * Theme
   */
  const styles = useStyles2(getStyles);

  /**
   * Render Views
   */
  const renderViews = (messages: Messages) => {
    const viewNames = Array.isArray(views) ? views : [];
    if (!viewNames.length) {
      return null;
    }

    return viewNames.map((name) => (
      <Button
        type="button"
        key={name}
        onClick={() => onView(name)}
        disabled={view === name}
        variant="secondary"
        data-testid={TEST_IDS.bigCalendarToolbar.buttonView(name)}
      >
        {messages[name]}
      </Button>
    ));
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.div}>
        <Button
          type="button"
          onClick={() => onNavigate(Navigate.TODAY)}
          variant="secondary"
          data-testid={TEST_IDS.bigCalendarToolbar.buttonToday}
        >
          {messages.today}
        </Button>

        <ButtonGroup>
          <Button
            type="button"
            className={styles.prev}
            onClick={() => onNavigate(Navigate.PREVIOUS)}
            variant="secondary"
            data-testid={TEST_IDS.bigCalendarToolbar.buttonBack}
            icon="angle-left"
          />
          <Button
            type="button"
            onClick={() => onNavigate(Navigate.NEXT)}
            variant="secondary"
            data-testid={TEST_IDS.bigCalendarToolbar.buttonNext}
            icon="angle-right"
          />
        </ButtonGroup>
      </div>

      <span className={styles.date}>{label}</span>

      <ButtonGroup>{renderViews(messages)}</ButtonGroup>
    </div>
  );
};
