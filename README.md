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
const { retryIgnoreAbort } = require('retry-ignore-abort');
```

If you use TypeScript, use the following code instead:

```typescript
import { retryIgnoreAbort } from 'retry-ignore-abort';
```

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
