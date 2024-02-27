import { classicColors, FieldColorModeId, FieldConfigSource, getFieldColorMode } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { useMemo } from 'react';

/**
 * Get Colors
 * @param fieldConfig
 */
export const useColors = (fieldConfig?: FieldConfigSource) => {
  const theme = useTheme2();

  return useMemo(() => {
    let colors = classicColors;
    if (fieldConfig?.defaults.color) {
      const mode = getFieldColorMode(fieldConfig.defaults.color.mode);
      if (mode && mode.getColors) {
        colors = mode.getColors(theme);
      } else if (fieldConfig.defaults.color.mode === FieldColorModeId.Fixed && fieldConfig.defaults.color.fixedColor) {
        colors = [fieldConfig.defaults.color.fixedColor];
      }
    }
    return colors;
  }, [fieldConfig?.defaults.color, theme]);
};
