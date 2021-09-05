import { config } from '@grafana/runtime';
import {
  ContextMenu as GrafanaContextMenu,
  MenuGroup as GrafanaMenuGroup,
  MenuItem as GrafanaMenuItem,
  MenuItemProps as GrafanaMenuItemProps,
} from '@grafana/ui';
import React from 'react';
import { gte } from 'semver';
import { LegacyContextMenu } from './LegacyContextMenu';

export interface MenuGroup {
  label: string;
  items: GrafanaMenuItemProps[];
}

interface Props {
  x: number;
  y: number;
  onClose: () => void;
  renderMenuItems: () => MenuGroup[];
  renderHeader: () => React.ReactNode;
}

/**
 * ContextMenu is a wrapper for the grafana/ui ContextMenu that falls back to
 * a legacy version on earlier versions of Grafana.
 */
export const ContextMenu = ({ x, y, onClose, renderMenuItems, renderHeader }: Props) => {
  const version = config.buildInfo.version;
  if (gte(version, '8.0.0')) {
    return (
      <GrafanaContextMenu
        x={x}
        y={y}
        onClose={onClose}
        renderMenuItems={() =>
          renderMenuItems().map((group, index) => (
            <GrafanaMenuGroup key={`${group.label}${index}`} label={group.label} ariaLabel={group.label}>
              {(group.items || []).map((item) => (
                <GrafanaMenuItem key={item.label} {...item} />
              ))}
            </GrafanaMenuGroup>
          ))
        }
        renderHeader={renderHeader}
      />
    );
  } else {
    return (
      <LegacyContextMenu x={x} y={y} onClose={onClose} renderMenuItems={renderMenuItems} renderHeader={renderHeader} />
    );
  }
};
