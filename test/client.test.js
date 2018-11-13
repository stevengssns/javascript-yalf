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
  const meta = {
    bar: 'bar',
  };
  const clientMeta = {
    foo: 'bar',
    bar: 'foo',
  };
  const clientTags = ['test', 'jest'];
  function validate(logEvent, level, message) {
    expect(logEvent.level).toEqual(level.toString());
    expect(logEvent.message).toEqual(message);
    expect(logEvent.meta).toHaveProperty('foo', clientMeta.foo);
    expect(logEvent.meta).toHaveProperty('bar', meta.bar);
    clientTags.forEach((tag) => {
      expect(logEvent.tags).toContain(tag);
    });
  }
  beforeAll(() => {
    myLogger = new Logger();
    myLogger.level = debugLevel;
    myClient = myLogger.client(clientMeta, clientTags);
  });
  test('Test Client#log(errorLevel, message, meta)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.log(errorLevel, message, meta);
  });
  test('Test Client#error(message, meta)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.error(message, meta);
  });
  test('Test Client#log(warnLevel, message, meta)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.log(warnLevel, message, meta);
  });
  test('Test Client#warn(message, meta)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.warn(message, meta);
  });
  test('Test Client#log(infoLevel, message, meta)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.log(infoLevel, message, meta);
  });
  test('Test Client#info(message, meta)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.info(message, meta);
  });
  test('Test Client#log(debugLevel, message, meta)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.log(debugLevel, message, meta);
  });
  test('Test Client#debug(message, meta)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.debug(message, meta);
  });
});

/** @test {Client#metaWrapper} */
describe('Client#metaWrapper', () => {
  let myLogger;
  let myClient;
  const meta = {
    bar: 'bar',
  };
  const wrapperMeta = {
    baz: 'foo',
    bar: 'foo',
  };
  const clientMeta = {
    foo: 'bar',
  };
  const clientTags = ['test', 'jest'];
  function validate(logEvent, level, message) {
    expect(logEvent.level).toEqual(level.toString());
    expect(logEvent.message).toEqual(message);
    expect(logEvent.meta).toHaveProperty('foo', clientMeta.foo);
    expect(logEvent.meta).toHaveProperty('baz', wrapperMeta.baz);
    expect(logEvent.meta).toHaveProperty('bar', meta.bar);
    clientTags.forEach((tag) => {
      expect(logEvent.tags).toContain(tag);
    });
  }
  beforeAll(() => {
    myLogger = new Logger();
    myLogger.level = debugLevel;
    myClient = myLogger.client(clientMeta, clientTags);
  });
  test('Test Client#log(errorLevel, message, meta)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.log(errorLevel, message, meta); }, wrapperMeta)();
  });
  test('Test Client#error(message, meta)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.error(message, meta); }, wrapperMeta)();
  });
  test('Test Client#log(warnLevel, message, meta)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.log(warnLevel, message, meta); }, wrapperMeta)();
  });
  test('Test Client#warn(message, meta)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.warn(message, meta); }, wrapperMeta)();
  });
  test('Test Client#log(infoLevel, message, meta)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.log(infoLevel, message, meta); }, wrapperMeta)();
  });
  test('Test Client#info(message, meta)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.info(message, meta); }, wrapperMeta)();
  });
  test('Test Client#log(debugLevel, message, meta)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.log(debugLevel, message, meta); }, wrapperMeta)();
  });
  test('Test Client#debug(message, meta)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.metaWrapper(() => { myClient.debug(message, meta); }, wrapperMeta)();
  });
});

/** @test {Client#tagsWrapper} */
describe('Client#tagsWrapper', () => {
  let myLogger;
  let myClient;
  const wrapperTags = ['foo', 'bar'];
  const clientTags = ['test', 'jest'];
  function validate(logEvent, level, message) {
    expect(logEvent.level).toEqual(level.toString());
    expect(logEvent.message).toEqual(message);
    wrapperTags.forEach((tag) => {
      expect(logEvent.tags).toContain(tag);
    });
    clientTags.forEach((tag) => {
      expect(logEvent.tags).toContain(tag);
    });
  }
  beforeAll(() => {
    myLogger = new Logger();
    myLogger.level = debugLevel;
    myClient = myLogger.client({}, clientTags);
  });
  test('Test Client#log(errorLevel, message)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.log(errorLevel, message); }, ...wrapperTags)();
  });
  test('Test Client#error(message)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.error(message); }, ...wrapperTags)();
  });
  test('Test Client#log(warnLevel, message)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.log(warnLevel, message); }, ...wrapperTags)();
  });
  test('Test Client#warn(message)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.warn(message); }, ...wrapperTags)();
  });
  test('Test Client#log(infoLevel, message)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.log(infoLevel, message); }, ...wrapperTags)();
  });
  test('Test Client#info(message)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.info(message); }, ...wrapperTags)();
  });
  test('Test Client#log(debugLevel, message)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.log(debugLevel, message); }, ...wrapperTags)();
  });
  test('Test Client#debug(message)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.tagsWrapper(() => { myClient.debug(message); }, ...wrapperTags)();
  });
});

/** @test {Client#wrapper} */
describe('Client#metaWrapper', () => {
  let myLogger;
  let myClient;
  const meta = {
    bar: 'bar',
  };
  const wrapperMeta = {
    baz: 'foo',
    bar: 'foo',
  };
  const clientMeta = {
    foo: 'bar',
  };
  const wrapperTags = ['foo', 'bar'];
  const clientTags = ['test', 'jest'];
  function validate(logEvent, level, message) {
    expect(logEvent.level).toEqual(level.toString());
    expect(logEvent.message).toEqual(message);
    expect(logEvent.meta).toHaveProperty('foo', clientMeta.foo);
    expect(logEvent.meta).toHaveProperty('baz', wrapperMeta.baz);
    expect(logEvent.meta).toHaveProperty('bar', meta.bar);
    wrapperTags.forEach((tag) => {
      expect(logEvent.tags).toContain(tag);
    });
    clientTags.forEach((tag) => {
      expect(logEvent.tags).toContain(tag);
    });
  }
  beforeAll(() => {
    myLogger = new Logger();
    myLogger.level = debugLevel;
    myClient = myLogger.client(clientMeta, clientTags);
  });
  test('Test Client#log(errorLevel, message, meta)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.wrapper(
      () => { myClient.log(errorLevel, message, meta); },
      wrapperMeta,
      ...wrapperTags,
    )();
  });
  test('Test Client#error(message, meta)', (done) => {
    const message = 'Logged error!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, errorLevel, message);
      done();
    });
    myClient.wrapper(() => { myClient.error(message, meta); }, wrapperMeta, ...wrapperTags)();
  });
  test('Test Client#log(warnLevel, message, meta)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.wrapper(
      () => { myClient.log(warnLevel, message, meta); },
      wrapperMeta,
      ...wrapperTags,
    )();
  });
  test('Test Client#warn(message, meta)', (done) => {
    const message = 'Logged warning!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, warnLevel, message);
      done();
    });
    myClient.wrapper(
      () => { myClient.warn(message, meta); },
      wrapperMeta,
      ...wrapperTags,
    )();
  });
  test('Test Client#log(infoLevel, message, meta)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.wrapper(
      () => { myClient.log(infoLevel, message, meta); }
      ,
      wrapperMeta,
      ...wrapperTags,
    )();
  });
  test('Test Client#info(message, meta)', (done) => {
    const message = 'Logged info!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, infoLevel, message);
      done();
    });
    myClient.wrapper(
      () => { myClient.info(message, meta); },
      wrapperMeta,
      ...wrapperTags,
    )();
  });
  test('Test Client#log(debugLevel, message, meta)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.wrapper(
      () => { myClient.log(debugLevel, message, meta); },
      wrapperMeta,
      ...wrapperTags,
    )();
  });
  test('Test Client#debug(message, meta)', (done) => {
    const message = 'Logged debug!';
    myLogger.setLogHandlers((logEvent) => {
      validate(logEvent, debugLevel, message);
      done();
    });
    myClient.wrapper(
      () => { myClient.debug(message, meta); },
      wrapperMeta,
      ...wrapperTags,
    )();
  });
});
