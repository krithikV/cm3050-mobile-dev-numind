import { formatCurrency, parsePositiveAmount } from '../../lib/format';

describe('formatCurrency', () => {
  it('formats to two decimal places with a dollar sign', () => {
    expect(formatCurrency(20)).toBe('$20.00');
    expect(formatCurrency(19.5)).toBe('$19.50');
    expect(formatCurrency(0)).toBe('$0.00');
  });
});

describe('parsePositiveAmount', () => {
  it('parses a valid positive number', () => {
    expect(parsePositiveAmount('20')).toBe(20);
    expect(parsePositiveAmount('19.99')).toBe(19.99);
  });

  it('rejects empty input', () => {
    expect(parsePositiveAmount('')).toBeNull();
    expect(parsePositiveAmount('   ')).toBeNull();
  });

  it('rejects non-numeric input', () => {
    expect(parsePositiveAmount('abc')).toBeNull();
  });

  it('rejects zero and negative amounts', () => {
    expect(parsePositiveAmount('0')).toBeNull();
    expect(parsePositiveAmount('-5')).toBeNull();
  });
});
