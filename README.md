# retry-ignore-abort

retry-ignore-abort manages function calls.

## Status

| Category         | Status                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| Version          | [![npm](https://img.shields.io/npm/v/retry-ignore-abort)](https://www.npmjs.com/package/retry-ignore-abort)     |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/retry-ignore-abort)                                          |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/retry-ignore-abort)                                      |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/retry-ignore-abort/workflows/Release/badge.svg?branch=master) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/retry-ignore-abort)                                |

## Installation

```shell
$ npm install retry-ignore-abort
```

## Quick Start

First you need to add a reference to assertthat to your application.

```javascript
const { retry, retryIgnoreAbort } = require('retry-ignore-abort');
```

If you use TypeScript, use the following code instead:

```typescript
import { retry, retryIgnoreAbort } from 'retry-ignore-abort';
```

### retry

`retry` is inspired by [async-retry](https://github.com/zeit/async-retry) and has the same function signature.

With it you can retry the execution of a function with exponentially increasing timeouts like so:

```javascript
const response = await retry(
  () => {
    return await axios('http://some-server/some-route');
  }
);
```

This will try to fetch `http://some-server/some-route` and retry in case of network errors.

For an overview of all options and available callbacks see the [options documentation](https://github.com/tim-kos/node-retry#retryoperationoptions) of [retry](https://github.com/tim-kos/node-retry), which this is based on.

### retryIgnoreAbort

Then you can wrap a number of functions inside of a call to `retryIgnoreAbort`. The functions may be `async`, if needed, but synchronous functions work as well.

Additionally, you have to provide a function that is called when an exception is thrown. Again, this function may be `async`, but it does not need to be. The exception that was thrown is handed over as a parameter. Return `retry`, `ignore`, or `abort` to retry, ignore or abort the previous function call:

```javascript
await retryIgnoreAbort(
  [
    async () => {
      // ...
    },
    async () => {
      // ...
    },
    async () => {
      // ...
    }
  ],
  async ex => {
    // Decide what to do, and return 'retry', 'ignore', or 'abort'.
    return 'ignore';
  }
);
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```
