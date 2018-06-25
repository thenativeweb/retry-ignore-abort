# retry-ignore-abort

retry-ignore-abort manages function calls.

## Installation

```shell
$ npm install retry-ignore-abort
```

## Quick start

First you need to integrate retry-ignore-abort into your application.

```javascript
const retry = require('retry-ignore-abort');
```

Then you can wrap a number of functions inside of a call to `retry`. The functions may be `async`, if needed, but synchronous functions work as well.

Additionally, you have to provide a function that is called when an exception is thrown. Again, this function may be `async`, but it does not need to be. The exception that was thrown is handed over as a parameter. Return `retry`, `ignore`, or `abort` to retry, ignore or abort the previous function call:

```javascript
await retry([
  async () => {
    // ...
  },
  async () => {
    // ...
  },
  async () => {
    // ...
  }
], async ex => {
  // Decide what to do, and return 'retry', 'ignore', or 'abort'.
  return 'ignore';
});
```

*Please note that you need not return the value of choice in lower case, as it gets transformed to lower case internally.*

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```

## License

The MIT License (MIT)
Copyright (c) 2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
