# YALF

> Yet Another Logging Framework

A simple logger API that is easy to use, and aimed at obtaining 
consistent structured logging.

The client API is compatible with, and a minimal extension of, 
the `console` interface.
By default it generates structured `JSON` log messages that are sent 
to the `console`, but this behavior can be fully tailored if desired.

###### Why a custom Logger?

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
import { Logger, developmentMode } from 'yalf';

const logger = new Logger();

// Set development mode to get pretty printed output.
logger.mode = developmentMode;

// Instantiate a log client with some optional meta data and tags.
// These will be appended to every log entry.
const log = logger.client({ 'env': 'development'}, ['demo']);

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

> TODO: Explain possible transpilation need!


## Documentation

> TODO: Document basic logging (debug, info, warn, error) API's

> TODO: Document basic configuration (mode, level, meta, tags) API's

> TODO: Document function wrapper helper API's

> TODO: Document advanced configuration (log handlers) API's

> TODO: Document console hijacking functionality


## TODO's
- [ ] Elaborate Jest Unit tests
- [ ] Check if JSON injection is a possible security issue.
- [ ] Try to add TypeScript Descriptor to ease development (better IDE tooling support) 
- [ ] Complete Documentation

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