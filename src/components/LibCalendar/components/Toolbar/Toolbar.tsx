import React from 'react';
import { ToolbarProps, Navigate, Messages } from 'react-big-calendar';
import { ButtonGroup, Button, useStyles2 } from '@grafana/ui';
import { Styles } from '../../styles';

interface Props extends ToolbarProps {}

export const Toolbar: React.FC<Props> = ({ localizer: { messages }, label, onNavigate, views, view, onView }) => {
  /**
   * Theme
   */
  const styles = useStyles2(Styles);

  const renderViews = (messages: Messages) => {
    const viewNames = Array.isArray(views) ? views : [];

    if (viewNames.length > 1) {
      return viewNames.map((name) => (
        <Button type="button" key={name} onClick={() => onView(name)} disabled={view === name} variant="secondary">
          {messages[name]}
        </Button>
      ));
    }
    return null;
  };

  return (
    <div className={styles.toolbar}>
      <ButtonGroup>
        <Button type="button" onClick={() => onNavigate(Navigate.TODAY)} variant="secondary">
          {messages.today}
        </Button>
        <Button type="button" onClick={() => onNavigate(Navigate.PREVIOUS)} variant="secondary">
          {messages.previous}
        </Button>
        <Button type="button" onClick={() => onNavigate(Navigate.NEXT)} variant="secondary">
          {messages.next}
        </Button>
      </ButtonGroup>

      <span>{label}</span>

      <ButtonGroup>{renderViews(messages)}</ButtonGroup>
    </div>
  );
};
