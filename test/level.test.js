import { errorLevel, warnLevel, infoLevel, debugLevel } from '../src/index';

/** @test {Level#includes} */
describe('Levels should include all lower levels', () => {
  test('Debug level', () => {
    expect(debugLevel.includes(errorLevel)).toBe(true);
    expect(debugLevel.includes(warnLevel)).toBe(true);
    expect(debugLevel.includes(infoLevel)).toBe(true);
    expect(debugLevel.includes(debugLevel)).toBe(true);
  });

  test('Info level', () => {
    expect(infoLevel.includes(errorLevel)).toBe(true);
    expect(infoLevel.includes(warnLevel)).toBe(true);
    expect(infoLevel.includes(infoLevel)).toBe(true);
    expect(infoLevel.includes(debugLevel)).toBe(false);
  });

  test('Warn level', () => {
    expect(warnLevel.includes(errorLevel)).toBe(true);
    expect(warnLevel.includes(warnLevel)).toBe(true);
    expect(warnLevel.includes(infoLevel)).toBe(false);
    expect(warnLevel.includes(debugLevel)).toBe(false);
  });

  test('Error level', () => {
    expect(errorLevel.includes(errorLevel)).toBe(true);
    expect(errorLevel.includes(warnLevel)).toBe(false);
    expect(errorLevel.includes(infoLevel)).toBe(false);
    expect(errorLevel.includes(debugLevel)).toBe(false);
  });
});
