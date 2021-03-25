# retry-ignore-abort

retry-ignore-abort handles function calls and their potential failure.

## Status

| Category         | Status                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| Version          | [![npm](https://img.shields.io/npm/v/retry-ignore-abort)](https://www.npmjs.com/package/retry-ignore-abort)     |
| Dependencies     | ![David](https://img.shields.io/david/thenativeweb/retry-ignore-abort)                                          |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/retry-ignore-abort)                                      |
| Build            | ![GitHub Actions](https://github.com/thenativeweb/retry-ignore-abort/workflows/Release/badge.svg?branch=main) |
| License          | ![GitHub](https://img.shields.io/github/license/thenativeweb/retry-ignore-abort)                                |

## Installation

```shell
$ npm install retry-ignore-abort
```

## Quick Start

First you need to add a reference to retry-ignore-abort to your application:

```javascript
const { retry, retryIgnoreAbort } = require('retry-ignore-abort');
```

If you use TypeScript, use the following code instead:

```typescript
import { retry, retryIgnoreAbort } from 'retry-ignore-abort';
```

### Retrying functions

Sometimes you may want to retry a function in case it fails. For that, use the `retry` function:

```javascript
await retry(async () => {
  // ...
});
```

By default, this performs five retries (i.e., in the worst case the function is run six times), with exponentially increasing timeouts, starting with a delay of 1 second.

If you want to adjust these values, you need to specify an options object with the following properties:

```javascript
await retry(async () => {
  // ...
}, {
  retries: 5,
  minTimeout: 1_000,
  maxTimeout: 60_000,
  factor: 2
});
```

If the retried function succeeds and returns a value, this value is returned by the `retry` function:

```javascript
const result = await retry(async () => {
  // ...

  return result;
});
```

In case the function still fails after all retries have been exhausted, an exception is thrown that contains the exception thrown by the inner function in its `data` property.

### Retrying multiple functions

From time to time you have a variety of functions, that need to be run in sequence. In case one of them fails, you may want to retry it, ignore it, or abort the entire sequence. For this, use the `retryIgnoreAbort` function and hand over an array of functions to run in sequence.

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

## Running quality assurance

To run quality assurance for this module use [roboter](https://www.npmjs.com/package/roboter):

```shell
$ npx roboter
```
