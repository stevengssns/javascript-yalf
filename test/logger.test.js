import { Logger, errorLevel, warnLevel, infoLevel, debugLevel, productionMode, developmentMode } from '../src/index';

/** @test {Logger#level} */
describe('Logger#level', () => {
  test('Error is the default log level', () => {
    const myLogger = new Logger();
    expect(myLogger.level).toBe(errorLevel);
  });
});

/** @test {Logger#mode} */
describe('Logger#mode', () => {
  test('Production mode is the default mode', () => {
    const myLogger = new Logger();
    expect(myLogger.mode).toBe(productionMode);
  });
  test('Development mode is supported', () => {
    const myLogger = new Logger();
    myLogger.mode = developmentMode;
    expect(myLogger.mode).toBe(developmentMode);
  });
  test('Production mode is supported', () => {
    const myLogger = new Logger();
    myLogger.mode = productionMode;
    expect(myLogger.mode).toBe(productionMode);
  });
  test('Other modes are nog supported', () => {
    const myLogger = new Logger();
    expect(() => { myLogger.mode = Symbol('unsupported mode'); }).toThrow();
    expect(() => { myLogger.mode = 'foo'; }).toThrow();
    expect(() => { myLogger.mode = undefined; }).toThrow();
  });
});
