import React from 'react';
import { ProgressRing } from '../ui/ProgressRing';
import { accents } from '../../lib/theme';

type WaterRingProps = {
  currentMl: number;
  goalMl: number;
  size?: number;
};

export function WaterRing({ currentMl, goalMl, size = 160 }: WaterRingProps) {
  const progress = goalMl > 0 ? currentMl / goalMl : 0;
  return (
    <ProgressRing
      progress={progress}
      size={size}
      strokeWidth={14}
      color={accents.hydration}
      label={`${(currentMl / 1000).toFixed(2)}L`}
      sublabel={`of ${(goalMl / 1000).toFixed(1)}L goal`}
    />
  );
}
