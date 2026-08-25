import { useAlarmsStore, dueAlarms, Alarm } from '../store/useAlarmsStore';

const alarm = (overrides: Partial<Alarm>): Alarm => ({
  id: '1',
  label: 'Walk break',
  hour: 15,
  minute: 0,
  enabled: true,
  lastFiredDate: null,
  ...overrides,
});

describe('useAlarmsStore', () => {
  beforeEach(() => {
    useAlarmsStore.setState({ alarms: [] });
  });

  it('adds an alarm, enabled by default with no last-fired date', () => {
    useAlarmsStore.getState().addAlarm({ label: 'Walk break', hour: 15, minute: 0 });
    const alarms = useAlarmsStore.getState().alarms;
    expect(alarms).toHaveLength(1);
    expect(alarms[0].enabled).toBe(true);
    expect(alarms[0].lastFiredDate).toBeNull();
  });

  it('updates an alarm', () => {
    useAlarmsStore.getState().addAlarm({ label: 'Walk break', hour: 15, minute: 0 });
    const id = useAlarmsStore.getState().alarms[0].id;
    useAlarmsStore.getState().updateAlarm(id, { label: 'Evening walk', hour: 18 });
    const updated = useAlarmsStore.getState().alarms[0];
    expect(updated.label).toBe('Evening walk');
    expect(updated.hour).toBe(18);
  });

  it('toggles an alarm on and off', () => {
    useAlarmsStore.getState().addAlarm({ label: 'Walk break', hour: 15, minute: 0 });
    const id = useAlarmsStore.getState().alarms[0].id;
    useAlarmsStore.getState().toggleAlarm(id, false);
    expect(useAlarmsStore.getState().alarms[0].enabled).toBe(false);
  });

  it('deletes an alarm', () => {
    useAlarmsStore.getState().addAlarm({ label: 'Walk break', hour: 15, minute: 0 });
    const id = useAlarmsStore.getState().alarms[0].id;
    useAlarmsStore.getState().deleteAlarm(id);
    expect(useAlarmsStore.getState().alarms).toHaveLength(0);
  });

  it('marks an alarm as fired for a date', () => {
    useAlarmsStore.getState().addAlarm({ label: 'Walk break', hour: 15, minute: 0 });
    const id = useAlarmsStore.getState().alarms[0].id;
    useAlarmsStore.getState().markFired(id, '2026-03-01');
    expect(useAlarmsStore.getState().alarms[0].lastFiredDate).toBe('2026-03-01');
  });
});

describe('dueAlarms', () => {
  it('is due once the current time has passed the alarm time and it has not fired today', () => {
    const now = new Date(2026, 2, 1, 15, 5); // 3:05pm
    const alarms = [alarm({ hour: 15, minute: 0 })];
    expect(dueAlarms(alarms, now, '2026-03-01')).toHaveLength(1);
  });

  it('is not due before the alarm time', () => {
    const now = new Date(2026, 2, 1, 14, 55); // 2:55pm
    const alarms = [alarm({ hour: 15, minute: 0 })];
    expect(dueAlarms(alarms, now, '2026-03-01')).toHaveLength(0);
  });

  it('is due exactly at the alarm minute', () => {
    const now = new Date(2026, 2, 1, 15, 0);
    const alarms = [alarm({ hour: 15, minute: 0 })];
    expect(dueAlarms(alarms, now, '2026-03-01')).toHaveLength(1);
  });

  it('is not due again once already fired today', () => {
    const now = new Date(2026, 2, 1, 16, 0);
    const alarms = [alarm({ hour: 15, minute: 0, lastFiredDate: '2026-03-01' })];
    expect(dueAlarms(alarms, now, '2026-03-01')).toHaveLength(0);
  });

  it('ignores disabled alarms', () => {
    const now = new Date(2026, 2, 1, 16, 0);
    const alarms = [alarm({ hour: 15, minute: 0, enabled: false })];
    expect(dueAlarms(alarms, now, '2026-03-01')).toHaveLength(0);
  });
});
