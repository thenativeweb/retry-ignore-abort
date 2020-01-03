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

First you need to add a reference to `retry-ignore-abort` to your application:

```javascript
const { retry, retryIgnoreAbort } = require('retry-ignore-abort');
```

If you use TypeScript, use the following code instead:

```typescript
import { retry, retryIgnoreAbort } from 'retry-ignore-abort';
```

### retry

With it you can retry the execution of a function with exponentially increasing timeouts like so:

```javascript
const response = await retry(
  () => {
    return await axios('http://some-server/some-route');
  }
);
```

This will try to fetch `http://some-server/some-route` and retry in case of network errors.

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

## Details

### retry

The full signature for retry is:

```typescript
const retry = <TValue> (
  retryOperation: (retryCount: number) => Promise<TValue> | TValue,
  options?: {
    // The maximum amount of retries. Note that this __excludes__ the first try of the operation.
    retries?: number = 5;
    // The minimum amount of milliseconds between two tries.
    minTimeout?: number = 1_000;
    // The maximum amount of milliesconds between two tries.
    maxTimeout?: number = 60_000;
    // The factor with which the timeout grows exponentially.
    factor?: number = 2;
  }
): Promise<TValue | undefined>;
```

Retry can throw several [defekt](https://github.com/thenativeweb/defekt) errors:

- `OptionsInvalid` is thrown if the options given don't make sense.
- `RetriesExceeded` is thrown if the operation fails more often than allowed. This error contains the last exception thrown by the operation on its `data` property.

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```
