import { selectors } from '@grafana/e2e-selectors';
import React, { ReactNode } from 'react';

import { TEST_IDS } from '../../../constants';

const actual = jest.requireActual('@grafana/ui');

const CardHeading = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardMeta = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardTags = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardDescription = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const CardActions = ({ children }: { children: ReactNode }) => <div>{children}</div>;

export const Card = ({ children }: { children: ReactNode }) => (
  <div className="card" data-testid={TEST_IDS.eventDetails.root}>
    {React.Children.map(children, (child) => {
      return child;
    })}
  </div>
);

Card.Heading = CardHeading;
Card.Meta = CardMeta;
Card.Tags = CardTags;
Card.Description = CardDescription;
Card.Actions = CardActions;

/**
 * Drawer Mock
 * since grafana.ui version 11.5.1
 * ReferenceError: IntersectionObserver is not defined
 */
export const Drawer = ({ title, children, onClose }: any) => {
  return (
    <div>
      <button data-testid={selectors.components.Drawer.General.close} onClick={() => onClose()}>
        Close Drawer
      </button>
      {title}
      {children}
    </div>
  );
};

module.exports = {
  ...actual,
  Card,
  Drawer,
};
