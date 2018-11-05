import { Logger, errorLevel, warnLevel, infoLevel, debugLevel, productionMode, developmentMode } from '../src/index';

/** @test {Client#meta} */
describe('Client#meta', () => {
  test('By default there is no global meta data set', () => {
    const myLogger = new Logger();
    const myClient = myLogger.client();
    expect(myClient.meta).toEqual({});
  });
  test('Global meta data can be set at construction time', () => {
    const globalMeta = { foo: 'bar' };
    const myLogger = new Logger();
    const myClient = myLogger.client(globalMeta);
    expect(myClient.meta).not.toBe(globalMeta);
    expect(myClient.meta).toEqual(globalMeta);
  });
  test('Global meta data can be changed after construction time', () => {
    const globalMeta = { foo: 'bar' };
    const myLogger = new Logger();
    const myClient = myLogger.client(globalMeta);
    const newMeta = { bar: 'foo' };
    myClient.meta = newMeta;
    expect(myClient.meta).not.toBe(newMeta);
    expect(myClient.meta).toEqual(newMeta);
  });
  test('Meta data can be unset using undefined', () => {
    const globalMeta = { foo: 'bar' };
    const myLogger = new Logger();
    const myClient = myLogger.client(globalMeta);
    myClient.meta = undefined;
    expect(myClient.meta).toEqual({});
  });
});

/** @test {Client#tags} */
describe('Client#tags', () => {
  test('By default there are no global tags set', () => {
    const myLogger = new Logger();
    const myClient = myLogger.client();
    expect(myClient.tags).toEqual([]);
  });
  test('Global tags can be set at construction time', () => {
    const globalTags = ['foo'];
    const myLogger = new Logger();
    const myClient = myLogger.client({}, globalTags);
    expect(myClient.tags).not.toBe(globalTags);
    expect(myClient.tags).toEqual(globalTags);
  });
  test('Global tags can be changed after construction time', () => {
    const globalTags = ['foo'];
    const myLogger = new Logger();
    const myClient = myLogger.client({}, globalTags);
    const newTags = ['bar'];
    myClient.tags = newTags;
    expect(myClient.tags).not.toBe(newTags);
    expect(myClient.tags).toEqual(newTags);
  });
  test('Tags can be unset using undefined', () => {
    const globalTags = ['foo'];
    const myLogger = new Logger();
    const myClient = myLogger.client({}, globalTags);
    myClient.tags = undefined;
    expect(myClient.tags).toEqual([]);
  });
});

/** @test {Client} */
describe('Client', () => {
  let myLogger;
  let myClient;
  beforeAll(() => {
    myLogger = new Logger();
    myLogger.level = debugLevel;
    myClient = myLogger.client();
  });
  test('Test Client#log(errorLevel,message)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(errorLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.log(errorLevel, message);
  });
  test('Test Client#error(message)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(errorLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.error(message);
  });
  test('Test Client#log(warnLevel,message)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(warnLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.log(warnLevel, message);
  });
  test('Test Client#warn(message)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(warnLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.warn(message);
  });
  test('Test Client#log(infoLevel,message)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(infoLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.log(infoLevel, message);
  });
  test('Test Client#info(message)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(infoLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.info(message);
  });
  test('Test Client#log(debugLevel,message)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(debugLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.log(debugLevel, message);
  });
  test('Test Client#debug(message)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      expect(logEvent.level).toEqual(debugLevel.toString());
      expect(logEvent.message).toEqual(message);
      done();
    });
    myClient.debug(message);
  });
});
