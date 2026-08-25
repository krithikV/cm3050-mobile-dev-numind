import { format } from 'date-fns';

// Local-time yyyy-MM-dd key, used consistently so day boundaries match the
// device's timezone rather than UTC (toISOString().slice(0,10) would drift).
export function dateKey(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}
