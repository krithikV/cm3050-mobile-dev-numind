import React from 'react';
import { format, parseISO } from 'date-fns';
import { SvgBarChart } from '../charts/SvgBarChart';
import { accents } from '../../lib/theme';

type TrendChartProps = {
  data: { yyyyMM: string; income: number; expenses: number }[];
};

export function TrendChart({ data }: TrendChartProps) {
  const chartData = data.map((d) => ({
    label: format(parseISO(`${d.yyyyMM}-01`), 'MMM'),
    value: d.expenses,
  }));

  return <SvgBarChart data={chartData} color={accents.budget} />;
}
