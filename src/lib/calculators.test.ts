import {
  parseTimeToSeconds,
  formatSecondsToMMSS,
  formatSecondsToHHMMSS,
  paceFromTimeDistance,
  timeFromDistancePace,
  distanceFromTimePace,
  speedFromPace,
  paceFromSpeed,
  riegelPredict,
} from './calculators';

describe('calculators', () => {
  test('parseTimeToSeconds', () => {
    expect(parseTimeToSeconds('45')).toBe(45);
    expect(parseTimeToSeconds('5:00')).toBe(300);
    expect(parseTimeToSeconds('1:02:03')).toBe(3723);
  });

  test('formatSecondsToMMSS', () => {
    expect(formatSecondsToMMSS(300)).toBe('5:00');
    expect(formatSecondsToMMSS(305)).toBe('5:05');
  });

  test('formatSecondsToHHMMSS', () => {
    expect(formatSecondsToHHMMSS(3723)).toBe('1:02:03');
    expect(formatSecondsToHHMMSS(305)).toBe('5:05');
  });

  test('paceFromTimeDistance', () => {
    expect(paceFromTimeDistance('50:00', 10)).toBe('5:00 min/unit');
    expect(paceFromTimeDistance('25:00', 5)).toBe('5:00 min/unit');
  });

  test('timeFromDistancePace', () => {
    expect(timeFromDistancePace(10, '5:00')).toBe('50:00');
    expect(timeFromDistancePace(5, '4:30')).toBe('22:30');
  });

  test('distanceFromTimePace', () => {
    expect(distanceFromTimePace('50:00', '5:00')).toBe(10);
    expect(distanceFromTimePace('22:30', '4:30')).toBe(5);
  });

  test('speedFromPace', () => {
    expect(speedFromPace('5:00')).toBe('12.00');
    expect(speedFromPace('4:00')).toBe('15.00');
  });

  test('paceFromSpeed', () => {
    expect(paceFromSpeed('12.00')).toBe('5:00');
    expect(paceFromSpeed('15.0')).toBe('4:00');
    expect(paceFromSpeed('12,00')).toBe('5:00');
  });

  test('riegelPredict', () => {
    const t1 = parseTimeToSeconds('50:00');
    const d1 = 10;
    const d2 = 42.195;
    const t2 = riegelPredict(t1, d1, d2, 1.06);
    // Rough expected: 50 * (42.195/10)^1.06 ≈ 50 * 4.2195^1.06 ≈ 50 * ~4.56 ≈ 228 min
    expect(Math.round(t2 / 60)).toBeGreaterThanOrEqual(220);
    expect(Math.round(t2 / 60)).toBeLessThanOrEqual(240);
  });
});