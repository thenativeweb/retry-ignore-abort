'use strict';

const assert = require('assertthat');

const retry = require('../../src/retryIgnoreAbort');

suite('retryIgnoreAbort', () => {
  let functionsRun;

  const getFunction = function ({ name, successOnRun }) {
    return async function () {
      functionsRun.push(name);

      const numberOfRuns = functionsRun.filter(fn => fn === name).length;

      if (numberOfRuns === successOnRun) {
        return;
      }

      throw new Error(`Error in function ${name}.`);
    };
  };

  setup(() => {
    functionsRun = [];
  });

  test('throws an error when the functions are missing.', async () => {
    await assert.that(async () => {
      await retry();
    }).is.throwingAsync('Functions are missing.');
  });

  test('throws an error when the handler is missing.', async () => {
    await assert.that(async () => {
      await retry([]);
    }).is.throwingAsync('Handler is missing.');
  });

  test('runs all functions when no exception is thrown.', async () => {
    await retry([
      getFunction({ name: 'A', successOnRun: 1 }),
      getFunction({ name: 'B', successOnRun: 1 })
    ], () => {
      throw new Error('Invalid operation.');
    });

    assert.that(functionsRun).is.equalTo([ 'A', 'B' ]);
  });

  test('retries a failed function.', async () => {
    await retry([
      getFunction({ name: 'A', successOnRun: 2 }),
      getFunction({ name: 'B', successOnRun: 1 })
    ], () => 'retry');

    assert.that(functionsRun).is.equalTo([ 'A', 'A', 'B' ]);
  });

  test('ignores a failed function.', async () => {
    await retry([
      getFunction({ name: 'A', successOnRun: 2 }),
      getFunction({ name: 'B', successOnRun: 1 })
    ], () => 'ignore');

    assert.that(functionsRun).is.equalTo([ 'A', 'B' ]);
  });

  test('aborts on a failed function.', async () => {
    await assert.that(async () => {
      await retry([
        getFunction({ name: 'A', successOnRun: 2 }),
        getFunction({ name: 'B', successOnRun: 1 })
      ], () => 'abort');
    }).is.throwingAsync('Error in function A.');

    assert.that(functionsRun).is.equalTo([ 'A' ]);
  });
});
