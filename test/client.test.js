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


test('Test emit is called', (done) => {
  const myLogger = new Logger();
  const myClient = myLogger.client();
  const message = 'Logged error!';
  myLogger.setLogHandlers((logEvent) => {
    expect(logEvent.level).toEqual(errorLevel.toString());
    expect(logEvent.message).toEqual(message);
    done();
  });
  myClient.error(message);
});
