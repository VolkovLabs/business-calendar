import { ContextMenu, MenuItemProps } from '@grafana/ui';
import React from 'react';

const AnyContextMenu: any = ContextMenu;

interface MenuGroup {
  label: string;
  items: MenuItemProps[];
}

interface Props {
  x: number;
  y: number;
  onClose?: () => void;
  renderMenuItems?: () => MenuGroup[];
  renderHeader?: () => React.ReactNode;
}

/**
 * LegacyContextMenu adapts the context menu from 7.0 for the latest version of
 * grafana/ui. This component is a monstrosity—summoned in the
 * quest for backwards-compatibility.
 *
 * Since we don't have the correct type definitions, this component uses a
 * generous amount of any types. If I figure out how to do it, maybe we could
 * include our own type definitions.
 *
 * I tried including an older version of the grafana packages using package
 * aliases, but it wouldn't compile with recent version of grafana-toolkit.
 */
export const LegacyContextMenu = ({ x, y, onClose, renderMenuItems, renderHeader }: Props) => {
  const itemGroups: any[] | undefined = renderMenuItems
    ? renderMenuItems().map((group) => ({
        label: group.label,
        items: group.items.map((item) => ({ ...item })),
      }))
    : undefined;

  return <AnyContextMenu x={x} y={y} onClose={onClose} renderHeader={renderHeader} items={itemGroups} />;
};
