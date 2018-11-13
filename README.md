# YALF

> Yet Another Logging Framework

A simple logger API that is easy to use, and aimed at obtaining 
consistent structured logging.

The client API is compatible with, and a minimal extension of, 
the `console` interface.
By default it generates structured `JSON` log messages that are sent 
to the `console`, but this behavior can be fully tailored if desired.

##### Why a custom Logger?

Actually.. it isn't. 

There are several logging libraries to be found, and one of them is 
[lambda-log](https://www.npmjs.com/package/lambda-log). The author
poses the same question, and his arguments are very reasonable (check them 
out on the [GitHub](https://github.com/KyleRoss/node-lambda-log) project page). 
More importantly, his implementation is indeed very simple and dependency-free.

However, a fork and re-implementation was created for the following reasons:

- A few small features were missing (e.g. setting the active log level beyond 'dev',
and console hijacking).
- It's a very important piece of code if every project ends up depending on it.
- The code was re-implemented to the extent that was needed to keep the code 
clean after adding the additional features. 

## Getting Started

Simply install the `yalf` module ...

```bash
npm install yalf --save
```

... and start using it.

```javascript
import { Logger, debugLevel, developmentMode } from 'yalf';

// Instantiate the logger and configure it if desired.
const logger = new Logger();
// Set development mode to get pretty printed output.
// Defaults to 'productionMode'.
logger.mode = developmentMode;
// Set the logging level to debug.
// Defaults to 'errorLevel'.
logger.level = debugLevel;

// Instantiate a log client with some optional meta data and tags.
// These will be appended to every log entry.
const log = logger.client({ 'env': 'development' }, ['demo']);

// Log a simple info message.
log.info('Starting demo...');

// Log a debug message with some meta data.
log.debug(
  'Saving user preferences.', 
  {
    'user-id': 'lambda',
    'preferences': {
      // Some preferences
    }
  },
);

// Catch and log an Error.
try {
  throw new Error('Auww, I made a boo boo...');
} catch(err) {
  log.error(err);
}

```

The resulting log entries will be the following:

```bash
{
  "level": "info",
  "message": "Starting demo...",
  "meta": {
    "env": "development"
  },
  "tags": [
    "log",
    "info",
    "demo"
  ]
}
{
  "level": "debug",
  "message": "Saving user preferences.",
  "meta": {
    "user-id": "lambda",
    "preferences": {
      // Some preferences
    },
    "env": "development"
  },
  "tags": [
    "log",
    "debug",
    "demo"
  ]
}
{
  "level": "error",
  "message": "Auww, I made a boo boo...",
  "meta": {
    "stack": "Error: Auww, I made a boo boo...\n    at Object.<anonymous> ...(full stacktrace omitted)",
    "env": "development"
  },
  "tags": [
    "log",
    "error",
    "demo"
  ]
}

```


## Documentation

### Client API

###### Logger#client(meta = {}, tags = [])

Creates a log client that can be used to log messages.

| Argument  | Required? | Type     | Description                                                                                                                                    |
|-----------|-----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `meta`    | No        | Object   | Optional metadata object to include in the log messages.                                                                                       |
| `tags`    | No        | string[] | Optional tags to include in the log messages.                                                                                                  |


```javascript
import { Logger } from 'yalf';

const logger = new Logger();

const log = logger.client();
```

###### Level

The available levels should be imported from the module. Custom levels are currently not supported because the added complexity doesn't seem to be worth it.

```javascript
import { errorLevel, warnLevel, infoLevel, debugLevel } from 'yalf';
```

###### Client#log(level, message, meta = {})

If given level is included by the logger's current level, this emits a log event based on the provided parameters and the client configuration. If the message is an Error(-like) object, it's message property is used as the message, and the stak property is added to the meta data.  

| Argument  | Required? | Type   | Description                                                                                                                                    |
|-----------|-----------|--------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `level`   | Yes       | Level  | Log level for this log. Should be one of the available [levels](#level).                                                                       |
| `message` | Yes       | Object | Message to log. Can be of any type, but string or `Error` is recommended.                                                                      |
| `meta`    | No        | Object | Optional metadata object to include in the log JSON. This meta data will be merged with, and overwrite any, client wide meta data.             |

###### Client#debug(message, meta = {})

```javascript
log.debug('Debug message'); 
// is shorthand for 
log.log(debugLevel, 'Debug message');

```

###### Client#info(message, meta = {})

```javascript
log.info('Info message'); 
// is shorthand for 
log.log(infoLevel, 'Info message');

```

###### Client#warn(message, meta = {})

```javascript
log.warn('Warn message'); 
// is shorthand for 
log.log(warnLevel, 'Warn message');

```

###### Client#error(message, meta = {})

```javascript
log.error('Error message'); 
// is shorthand for 
log.log(errorLevel, 'Error message');

```

#### Function Wrappers

The client offers some wrapper methods that make it very easy to decorate existing functions in such a way that they will log additional meta data and/or tags for the duration of the wrapped function.

When wrapping, make sure the function is bound to the desired context!

###### Client#metaWrapper(fn, meta = {})

Creates a wrapper function that will add additional meta data to every log event. This meta data will be added to the client until the function returns.

| Argument  | Required? | Type      | Description                                                                                                                                    |
|-----------|-----------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `fn`      | Yes       | Function  | The function to wrap.                                                                                                                          |
| `meta`    | No        | Object    | Optional metadata object to include in the log JSON. This meta data will be merged with, and overwrite any, client wide meta data.             |

```javascript
function logSomething(message) {
  log.debug(message);
}
const logSomethingMore = log.metaWrapper(logSomething.bind(this), { foo: 'bar' });
logSomethingMore('Something more');

// this will log the same as
log.debug('Something more', { foo: 'bar' });

```

###### Client#tagsWrapper(fn, tags = [])

Creates a wrapper function that will add additional tags to every log event. These tags will be added to the client until the function returns.

| Argument  | Required? | Type      | Description                                                                                                                                    |
|-----------|-----------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `fn`      | Yes       | Function  | The function to wrap.                                                                                                                          |
| `tags`    | No        | ...string | Optional tags to include in the log messages.                                                                                                  |

```javascript
function logSomething(message) {
  log.debug(message);
}
const logSomethingMore = log.tagsWrapper(logSomething.bind(this), 'foo', 'bar');
logSomethingMore('Something more');

// this will log the same as
log.addTags('foo', 'bar');
log.debug('Something more');

```

###### Client#wrapper(fn, meta = {}, tags = [])

Creates a wrapper function that will add additional tags to every log event. These tags will be added to the client until the function returns.

| Argument  | Required? | Type      | Description                                                                                                                                    |
|-----------|-----------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `fn`      | Yes       | Function  | The function to wrap.                                                                                                                          |
| `meta`    | No        | Object    | Optional metadata object to include in the log JSON. This meta data will be merged with, and overwrite any, client wide meta data.             |
| `tags`    | No        | ...string | Optional tags to include in the log messages.                                                                                                  |

```javascript
function logSomething(message) {
  log.debug(message);
}
const logSomethingMore = log.wrapper(logSomething.bind(this), { foo: 'bar' }, 'foo', 'bar');
logSomethingMore('Something more');

// this will log the same as
log.addTags('foo', 'bar');
log.debug('Something more', { foo: 'bar' });

```

### Logger API

###### Logger#level

Setting the logger level will filter out any log events logged at a lower level.
The available levels should be imported from the module. Custom levels are currently not supported because the added complexity doesn't seem to be worth it.

The `errorLevel` is the default logger level.

```javascript
import { Logger, errorLevel, warnLevel, infoLevel, debugLevel } from 'yalf';

// Instantiate the logger and set the minimum log level.
const logger = new Logger();
logger.level = infoLevel;
```

###### Logger#mode

Setting the logger mode to `developmentMode` will make the default handler generate pretty printed JSON log messages.
Other handlers should ensure optimal performance for `productionMode`, and optimal developer experience for `developerMode`.

The available modes should be imported from the module. 
Currently only `developmentMode` and `productionMode` (default) are available.

```javascript
import { Logger, developmentMode, productionMode } from 'yalf';

// Instantiate the logger and set the desired mode.
const logger = new Logger();
logger.mode = developmentMode;
```

###### Logger#getOriginalConsoleFunction(logEvent)

Returns the (original) console function that matches the level of the given log event.
It can be used by custom log handlers if they wish to log to the console (even if it was hijacked!).

| Argument   | Required? | Type      | Description                                                                                                                                    |
|------------|-----------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `logEvent` | Yes       | LogEvent  | The log event for which the matching console function should be returned.                                                                      |

```javascript
import { Logger } from 'yalf';

function myHandler(logEvent) {
  // Do the logging through the original console.log
  const origConsoleFunction = this.getOriginalConsoleFunction(logEvent);
  origConsoleFunction.apply(
    null,
    [logEvent.toString()],
  );
}
// Instantiate the logger and set the custom handler.
const logger = new Logger();
logger.setLogHandlers(myHandler);

```

##### Log Handlers

TODO document how to create a log handler..

###### Logger#setLogHandlers(handlers)

Sets a given set of log handlers, overriding any previous ones.

| Argument   | Required? | Type        | Description                                                                                                                                    |
|------------|-----------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `handlers` | Yes       | ...Function | The log handlers to set.                                                                                                                       |

###### Logger#addLogHandler(handler)

Adds a given log handler to the current ones.

| Argument  | Required? | Type     | Description                                                                                                                                    |
|-----------|-----------|----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `handler` | Yes       | Function | The log handler to add.                                                                                                                        |

###### Logger#resetLogHandlers()

Resets the handlers to the default one(s).

###### Logger#initializeLogHandlers()

(Re-)initializes the log handlers by removing and adding them again.

### Console Hijacking

It could be the case that some third party libraries are logging to the console, and you would like a given logger to handle them.
This can be achieved by having a Logger instance `hijack` the console. 

When doing so, the original console functions will be replaced by those from a (fresh) client for the logger.
I.e. the console is (kind of) replaced by a client for the Logger instance.

It is also possible to have the logger add additional meta data and tags to every log event.
And when finished, the console can be released again.

This feature should be used with care, and it is probably not wise to hijack the console multiple times without releasing it first.

```javascript
import { Logger } from 'yalf';

const logger = new Logger();

// Hijack the console, and add some meta data and tags that should be added to every log message.
logger.hijackConsole({ foo: 'bar' }, 'console');
// Do some logging...
console.log("Console log message");
// Release the console again.
logger.releaseConsole();

```

## TODO's
- [ ] Improve Jest Unit tests
- [ ] Generate documentation
- [ ] Check if JSON injection is a possible security issue.
- [ ] Try to add TypeScript Descriptor to ease development (better IDE tooling support) 

## References

Some references that should convince the reader why structured logging is important.

- https://hackernoon.com/capture-and-forward-correlation-ids-through-different-lambda-event-sources-220c227c65f5
- https://hackernoon.com/you-need-to-use-structured-logging-with-aws-lambda-f3af9586d6a8

## License
MIT License

Copyright (c) 2018 Steven Goossens \
Copyright (c) 2017 Kyle Ross

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
