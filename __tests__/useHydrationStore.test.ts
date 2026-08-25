import {
  useHydrationStore,
  totalForDate,
  todaysTotal,
  logsForDate,
} from '../store/useHydrationStore';
import { dateKey } from '../lib/date';

describe('useHydrationStore', () => {
  beforeEach(() => {
    useHydrationStore.setState({ logs: [] });
  });

  it('adds a log for today with the given amount', () => {
    useHydrationStore.getState().addLog(250);
    const logs = useHydrationStore.getState().logs;
    expect(logs).toHaveLength(1);
    expect(logs[0].amountMl).toBe(250);
    expect(logs[0].date).toBe(dateKey());
  });

  it('removes a log by id', () => {
    useHydrationStore.getState().addLog(250);
    const id = useHydrationStore.getState().logs[0].id;
    useHydrationStore.getState().removeLog(id);
    expect(useHydrationStore.getState().logs).toHaveLength(0);
  });

  it('sums logs for a given date only', () => {
    useHydrationStore.getState().addLog(250);
    useHydrationStore.getState().addLog(500);
    useHydrationStore.setState({
      logs: [
        ...useHydrationStore.getState().logs,
        { id: 'old', date: '2020-01-01', amountMl: 1000, loggedAt: '2020-01-01T00:00:00.000Z' },
      ],
    });
    expect(totalForDate(useHydrationStore.getState().logs, dateKey())).toBe(750);
    expect(todaysTotal(useHydrationStore.getState().logs)).toBe(750);
  });

  it('returns logs for a date sorted most recent first', () => {
    const logs = [
      { id: '1', date: dateKey(), amountMl: 100, loggedAt: '2026-01-01T08:00:00.000Z' },
      { id: '2', date: dateKey(), amountMl: 200, loggedAt: '2026-01-01T10:00:00.000Z' },
    ];
    const result = logsForDate(logs, dateKey());
    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });
});
