/* eslint-disable no-console */
import { EventEmitter } from 'events';

// Some symbols that will help us to hide class instance properties from outside the module.
const levelSymbolSymbol = Symbol('levelSymbolSymbol');
const includedLevelsSymbol = Symbol('includedLevelsSymbol');
const errorLevelSymbol = Symbol('errorLevelSymbol');
const warnLevelSymbol = Symbol('warnLevelSymbol');
const infoLevelSymbol = Symbol('infoLevelSymbol');
const debugLevelSymbol = Symbol('debugLevelSymbol');

/**
 * A class representing a log level.
 * @package
 */
class Level {
  /**
   * Create a Level instance for a given symbol.
   * @param {symbol} levelSymbol The symbol representing the level.
   * @returns {Level} The Level instance for the given level symbol.
   * @throw {Error} When the provided symbol is not supported.
   */
  static create(levelSymbol) {
    if (Level[levelSymbol] === undefined) {
      Level[levelSymbol] = new Level(levelSymbol);
    }
    return Level[levelSymbol];
  }

  /** @type {symbol[]} The supported level symbols. */
  static get supportedLevelSymbols() {
    return [errorLevelSymbol, warnLevelSymbol, infoLevelSymbol, debugLevelSymbol];
  }

  /** @type {Level} The error level. */
  static get error() {
    return Level.create(errorLevelSymbol);
  }

  /** @type {Level} The warn level. */
  static get warn() {
    return Level.create(warnLevelSymbol);
  }

  /** @type {Level} The info level. */
  static get info() {
    return Level.create(infoLevelSymbol);
  }

  /** @type {Level} The debug level. */
  static get debug() {
    return Level.create(debugLevelSymbol);
  }

  /**
   * Creates a new Level instance for a given level symbol.
   * @param {symbol} levelSymbol The level symbol.
   * @throw {Error} When the provided symbol is not supported.
   */
  constructor(levelSymbol) {
    if (!Level.supportedLevelSymbols.includes(levelSymbol)) {
      throw new Error('The provided level symbol is not supported');
    }
    this[levelSymbolSymbol] = levelSymbol;
  }

  /**
   * The levels included by this level.
   * @returns {Level[]} The Array of levels included by the current one.
   */
  get includedLevels() {
    if (this[includedLevelsSymbol] === undefined) {
      switch (this[levelSymbolSymbol]) {
        case debugLevelSymbol:
          this[includedLevelsSymbol] = [Level.debug, ...Level.info.includedLevels];
          break;
        case infoLevelSymbol:
          this[includedLevelsSymbol] = [Level.info, ...Level.warn.includedLevels];
          break;
        case warnLevelSymbol:
          this[includedLevelsSymbol] = [Level.warn, ...Level.error.includedLevels];
          break;
        case errorLevelSymbol:
          this[includedLevelsSymbol] = [Level.error];
          break;
        default:
          // This should never be able to happen.
          throw new Error('Unsupported level symbol');
      }
    }
    return this[includedLevelsSymbol];
  }

  /**
   * Checks if a given level is included by this level.
   * @param {Level} level The level instance to check for.
   * @return {Boolean}     True if the given level is included by the current one, false otherwise.
   */
  includes(level) {
    return this.includedLevels.indexOf(level) !== -1;
  }

  /**
   * @returns {string} A human readable string representation.
   * @override
   */
  toString() {
    switch (this[levelSymbolSymbol]) {
      case errorLevelSymbol:
        return 'error';
      case warnLevelSymbol:
        return 'warn';
      case infoLevelSymbol:
        return 'info';
      case debugLevelSymbol:
        return 'debug';
      default:
        throw new Error('Unsupported level symbol');
    }
  }
}

/**
 * @type {Level} The error log level identifier.
 */
export const errorLevel = Level.error;

/**
 * @type {Level} The warn log level identifier.
 */
export const warnLevel = Level.warn;

/**
 * @type {Level} The info log level identifier.
 */
export const infoLevel = Level.info;

/**
 * @type {Level} The debug log level identifier.
 */
export const debugLevel = Level.debug;


// Some symbols that will help us to hide class instance properties from outside the module.
const levelSymbol = Symbol('levelSymbol');
const origConsoleLogFunctionsSymbol = Symbol('origConsoleLogFunctionsSymbol');
const metaSymbol = Symbol('metaSymbol');
const tagsSymbol = Symbol('tagsSymbol');
const modeSymbol = Symbol('modeSymbol');
const logHandlersSymbol = Symbol('logHandlersSymbol');

/**
 * @type {symbol} The production mode identifier.
 */
export const productionMode = Symbol('productionMode');

/**
 * @type {symbol} The development mode identifier.
 */
export const developmentMode = Symbol('developmentMode');

/**
 * A log event.
 * @private
 */
class LogEvent {
  /**
   * Creates a new LogEvent instance.
   * @param {string}   level The log level represented as a string.
   * @param {Object}   message The log message (string or `Error` are recommended).
   * @param {Object}   meta The log meta data.
   * @param {string[]} tags The log tags.
   * @param {symbol}   mode The logging mode (@link{developmentMode} or @link{productionMode}).
   */
  constructor(level, message, meta = {}, tags = [], mode = productionMode) {
    this.level = level;
    this.message = message;
    this.meta = meta;
    this.tags = tags;
    this.mode = mode;
  }

  /**
   * @returns {string} A human readable string representation.
   * @override
   */
  toString() {
    return JSON.stringify(this, null, this.mode === developmentMode ? 4 : 0);
  }
}


// Some symbols that will help us to hide class instance properties from outside the module.
const loggerSymbol = Symbol('loggerSymbol');

/**
 * The Logger Client API.
 * @public
 */
class Client {
  /**
   * Checks if value is an Error or Error-like object.
   * @param  {Object} val The value to test.
   * @return {boolean} Whether the value is an Error or Error-like object.
   */
  static isError(val) {
    return !!val && typeof val === 'object' && (
      val instanceof Error || ((typeof (val.message) !== 'undefined') && (typeof (val.stack) !== 'undefined'))
    );
  }

  /**
   * Creates new Logger Client instance.
   * @param {Logger} logger The Logger instance to emit the events to.
   * @param  {Object} meta The meta data to add to every log event.
   * @param  {string[]} tags The tags to add to every log event.
   */
  constructor(logger, meta = {}, tags = []) {
    // Setting initial configuration.
    this[loggerSymbol] = logger;
    this[metaSymbol] = meta;
    this[tagsSymbol] = tags;
  }

  /**
   * @type {Logger} logger The logger instance for this client.
   */
  get logger() {
    return this[loggerSymbol];
  }

  /**
   * @type {Object} meta The global meta data to be added to every log entry.
   */
  set meta(meta) {
    this[metaSymbol] = Object.assign({}, meta);
  }

  /**
   * @type {Object} meta The global meta data to be added to every log entry.
   */
  get meta() {
    return Object.assign({}, this[metaSymbol]);
  }

  /**
   * @type {string[]} tags The global tags to be added to every log entry.
   */
  set tags(tags) {
    if (tags === undefined) {
      this[tagsSymbol] = [];
    } else {
      this[tagsSymbol] = [...tags];
    }
  }

  /**
   * @type {string[]} tags The global tags to be added to every log entry.
   */
  get tags() {
    return [...this[tagsSymbol]];
  }

  /**
   * Add additional global meta data to be added to every log entry.
   * @param {Object} meta Additional global meta data to be added to every log entry.
   */
  addMeta(meta) {
    this[metaSymbol] = Object.assign(this[metaSymbol], meta);
  }

  /**
   * Add additional global tags to be added to every log entry.
   * @param {...string} tags Additional global tags to be added to every log entry.
   */
  addTags(...tags) {
    this[tagsSymbol] = [...this[tagsSymbol], ...tags];
  }

  /**
   * Generates a new function that will add additional meta data
   * to every log entry generated by the given function.
   * IMPORTANT: Do not forget to bind the given function to the desired context if desired.
   * E.g. when wrapping an Object instance method you should probably bind it to the instance.
   * @param {function} fn The function that needs to be wrapped.
   * @param {Object} meta The additional meta data to be added to every log entry.
   * @returns {function} The function that will add additional meta data to every
   * log entry generated by the given function.
   */
  metaWrapper(fn, meta) {
    const client = this;
    return (...args) => {
      const origMeta = client.meta;
      client.addMeta(meta);
      try {
        return fn(...args);
      } finally {
        client.meta = origMeta;
      }
    };
  }

  /**
   * Generates a new function that will add additional tags
   * to every log entry generated by the given function.
   * IMPORTANT: Do not forget to bind the given function to the desired context if desired.
   * E.g. when wrapping an Object instance method you should probably bind it to the instance.
   * @param {function} fn The function that needs to be wrapped.
   * @param {...string} tags The additional tags to be added to every log entry.
   * @returns {function} The function that will add additional tags to every
   * log entry generated by the given function.
   */
  tagsWrapper(fn, ...tags) {
    const client = this;
    return (...args) => {
      const origTags = client.tags;
      client.addTags(...tags);
      try {
        return fn(...args);
      } finally {
        client.tags = origTags;
      }
    };
  }

  /**
   * Generates a new function that will add additional meta data and tags
   * to every log entry generated by the given function.
   * IMPORTANT: Do not forget to bind the given function to the desired context if desired.
   * E.g. when wrapping an Object instance method you should probably bind it to the instance.
   * @param {function} fn The function that needs to be wrapped.
   * @param {Object} meta The additional meta data to be added to every log entry.
   * @param {...string} tags The additional tags to be added to every log entry.
   * @returns {function} The function that will add additional meta data and tags to every
   * log entry generated by the given function.
   */
  wrapper(fn, meta, ...tags) {
    return this.metaWrapper(this.tagsWrapper(fn, ...tags), meta);
  }

  /**
   * Creates log message based on the provided parameters.
   * @param  {Level} level Log level (`info`, `debug`, `warn` or `error`)
   * @param  {string} msg Message to log. Can be any type, but string or `Error` are recommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {LogEvent} The LogEvent instance that was emitted, or null if nothing was logged.
   */
  log(level, msg, meta = {}) {
    // Filter out levels that are not active.
    if (!this.logger.level.includes(level)) {
      return null;
    }

    let logEventMessage;
    const logEventErrorMeta = {};

    // If `msg` is an Error-like object, use the message and add the `stack` to `meta`
    if (Client.isError(msg)) {
      logEventErrorMeta.stack = msg.stack;
      logEventMessage = msg.message;
    } else {
      logEventMessage = msg;
    }

    const logEventMeta = Object.assign({}, this.meta, meta, logEventErrorMeta);
    const logEventTags = ['log', level.toString()].concat(this.tags);

    const logEvent = new LogEvent(
      level.toString(),
      logEventMessage,
      logEventMeta,
      logEventTags,
      this.logger.mode,
    );

    this.logger.emit('log', logEvent);
    return logEvent;
  }

  /**
   * Logs a debug message.
   * @param  {string} msg Message to log. Can be any type, but string or `Error` are recommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {LogEvent} The LogEvent instance that was emitted, or null if nothing was logged.
   */
  debug(msg, meta = {}) {
    return this.log(Level.debug, msg, meta);
  }

  /**
   * Logs an info message.
   * @param  {string} msg Message to log. Can be any type, but string or `Error` are recommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {LogEvent} The LogEvent instance that was emitted, or null if nothing was logged.
   */
  info(msg, meta = {}) {
    return this.log(Level.info, msg, meta);
  }

  /**
   * Logs a warn message.
   * @param  {string} msg Message to log. Can be any type, but string or `Error` are recommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {LogEvent} The LogEvent instance that was emitted, or null if nothing was logged.
   */
  warn(msg, meta = {}) {
    return this.log(Level.warn, msg, meta);
  }

  /**
   * Logs an error message.
   * @param  {string} msg Message to log. Can be any type, but string or `Error` are recommended.
   * @param  {Object} meta Optional meta data to attach to the log.
   * @return {LogEvent} The LogEvent instance that was emitted, or null if nothing was logged.
   */
  error(msg, meta = {}) {
    return this.log(Level.error, msg, meta);
  }
}

/**
 * Standardized log API with swappable log handling.
 * @extends {EventEmitter}
 * @public
 */
export class Logger extends EventEmitter {
  /** @type {symbol[]} The supported modes. */
  static get supportedModes() {
    return [developmentMode, productionMode];
  }

  /**
   * Creates new Logger instance.
   */
  constructor() {
    super();
    // Setting initial configuration.
    this[levelSymbol] = errorLevel;
    this[modeSymbol] = productionMode;
    // Save the original console prototype functions in case the console is hijacked.
    this[origConsoleLogFunctionsSymbol] = {};
    this[origConsoleLogFunctionsSymbol].log = console.log.bind(console);
    this[origConsoleLogFunctionsSymbol].debug = (typeof console.debug === 'function') ? console.debug.bind(console) : console.debug;
    this[origConsoleLogFunctionsSymbol].info = console.info.bind(console);
    this[origConsoleLogFunctionsSymbol].warn = console.warn.bind(console);
    this[origConsoleLogFunctionsSymbol].error = console.error.bind(console);
    // Register the default log handlers.
    this.resetLogHandlers();
  }

  /**
   * Sets the active log level ('debug', 'info', 'warn' or 'error').
   * @param {Level} level @link{debugLevel}, @link{infoLevel}, @link{warnLevel}, @link{errorLevel}.
   */
  set level(level) {
    this[levelSymbol] = level;
  }

  /**
   * The active log level ('debug', 'info', 'warn' or 'error').
   * @returns {Level} The active log level.
   */
  get level() {
    return this[levelSymbol];
  }

  /**
   * Sets the logger mode to either 'development' or 'production'.
   * When set to 'development' mode the default log handler will generate pretty-printed JSON logs.
   * @param {symbol} mode @link{developmentMode} or @link{productionMode}.
   * @throws {Error} When the provided mode is unsupported.
   */
  set mode(mode) {
    if (Logger.supportedModes.indexOf(mode) === -1) {
      throw new Error('Not a valid mode');
    }
    this[modeSymbol] = mode;
  }

  /**
   * The logger mode ('development' or 'production').
   * @returns {symbol} The logger mode (@link{developmentMode} or @link{productionMode}).
   */
  get mode() {
    return this[modeSymbol];
  }

  /**
   * Creates new Client instance for this logger.
   * @param {Object} meta Optional meta data to add to every log entry.
   * @param {string[]} tags Optional tags to add to every log entry.
   * @returns {Client} A new Logger Client instance.
   */
  client(meta = {}, tags = []) {
    return new Client(this, meta, tags);
  }

  /**
   * Get the original console function that matches the log level of the given
   * LogEvent instance.
   * @param {LogEvent} logEvent A log event instance.
   */
  getOriginalConsoleFunction(logEvent) {
    // For debug log messages we use the 'console#log' function!
    if (logEvent.level === debugLevel.toString()) {
      return this[origConsoleLogFunctionsSymbol].log;
    }
    return this[origConsoleLogFunctionsSymbol][logEvent.level];
  }

  /**
   * The log handler that sends log events to the console
   * (the original one in case it was hijacked!).
   * @type {Function} The default log handler function.
   */
  get defaultLogHandler() {
    return (logEvent) => {
      // Do the logging through the original console.log
      const origConsoleFunction = this.getOriginalConsoleFunction(logEvent);
      origConsoleFunction.apply(
        null,
        [logEvent.toString()],
      );
    };
  }

  /**
   * Reset the log handlers to the default ones.
   */
  resetLogHandlers() {
    this[logHandlersSymbol] = [this.defaultLogHandler];
    this.initializeLogHandlers();
  }

  /**
   * Set the log handlers.
   * @param {...function} handlers The array of log handler functions.
   */
  setLogHandlers(...handlers) {
    this[logHandlersSymbol] = [...handlers];
    this.initializeLogHandlers();
  }

  /**
   * Add log handler to the existing ones.
   * @param {function} handler The log handler function to add to the existing ones.
   */
  addLogHandler(handler) {
    this[logHandlersSymbol] = [...this[logHandlersSymbol], handler];
    this.initializeLogHandlers();
  }

  /**
   * (Re-)initialize the log handlers.
   */
  initializeLogHandlers() {
    this.removeAllListeners();
    this[logHandlersSymbol].forEach((handler) => {
      this.on('log', handler);
    });
  }

  /**
   * !!! USE WITH CARE !!!
   * Hijack the console by substituting its log functions for the ones from this logger.
   * This could be useful to capture log events generated by other libraries.
   * @param  {Object} meta The meta data to add to every log event.
   * @param  {string[]} tags The tags to add to every log event.
   */
  hijackConsole(meta = {}, tags = []) {
    const client = this.client(meta, tags);
    console.log = client.debug.bind(client);
    console.debug = client.debug.bind(client);
    console.info = client.info.bind(client);
    console.warn = client.warn.bind(client);
    console.error = client.error.bind(client);
  }

  /**
   * Undoes the console hijacking.
   */
  releaseConsole() {
    console.log = this[origConsoleLogFunctionsSymbol].log;
    console.debug = this[origConsoleLogFunctionsSymbol].debug;
    console.info = this[origConsoleLogFunctionsSymbol].info;
    console.warn = this[origConsoleLogFunctionsSymbol].warn;
    console.error = this[origConsoleLogFunctionsSymbol].error;
  }
}
