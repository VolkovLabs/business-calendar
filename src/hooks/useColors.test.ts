import { FieldColorModeId } from '@grafana/data';
import { renderHook } from '@testing-library/react';

import { useColors } from './useColors';

describe('useColors', () => {
  it('Should use get colors', () => {
    const { result } = renderHook(() =>
      useColors({
        defaults: {
          color: {
            mode: FieldColorModeId.ContinuousBlPu,
          },
        },
        overrides: [],
      })
    );

    expect(result.current).toEqual(['#5794F2', '#B877D9']);
  });

  it('Should use fixed color', () => {
    const { result } = renderHook(() =>
      useColors({
        defaults: {
          color: {
            mode: FieldColorModeId.Fixed,
            fixedColor: '#999999',
          },
        },
        overrides: [],
      })
    );

    expect(result.current).toEqual(['#999999']);
  });
});
