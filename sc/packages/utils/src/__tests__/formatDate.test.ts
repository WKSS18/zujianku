import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('formats a Date object to YYYY-MM-DD by default', () => {
    const date = new Date(2026, 3, 2); // April 2, 2026
    expect(formatDate(date)).toBe('2026-04-02');
  });

  it('formats a Date object with custom format YYYY/MM/DD', () => {
    const date = new Date(2026, 0, 15);
    expect(formatDate(date, 'YYYY/MM/DD')).toBe('2026/01/15');
  });

  it('formats a timestamp number', () => {
    const date = new Date(2026, 3, 2);
    expect(formatDate(date.getTime())).toBe('2026-04-02');
  });

  it('formats a date string', () => {
    expect(formatDate('2026-04-02')).toBe('2026-04-02');
  });

  it('returns empty string for invalid input', () => {
    expect(formatDate(null as unknown as Date)).toBe('');
    expect(formatDate(undefined as unknown as Date)).toBe('');
  });
});
