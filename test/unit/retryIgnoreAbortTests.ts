import { assert } from 'assertthat';
import { retryIgnoreAbort } from '../../lib/retryIgnoreAbort';

suite('retryIgnoreAbort', (): void => {
  let functionsRan: string[];

  const getFunction = function ({ name, successOnRun }: {
    name: string;
    successOnRun: number;
  }): () => Promise<void> {
    return async function (): Promise<void> {
      functionsRan.push(name);

      const numberOfRuns = functionsRan.filter(
        (fn: string): boolean => fn === name
      ).length;

      if (numberOfRuns === successOnRun) {
        return;
      }

      throw new Error(`Error in function ${name}.`);
    };
  };

  setup(async (): Promise<void> => {
    functionsRan = [];
  });

  test('runs all functions when no exception is thrown.', async (): Promise<void> => {
    await retryIgnoreAbort(
      [
        getFunction({ name: 'A', successOnRun: 1 }),
        getFunction({ name: 'B', successOnRun: 1 })
      ],
      async (): Promise<'retry' | 'ignore' | 'abort'> => {
        throw new Error('Invalid operation.');
      }
    );

    assert.that(functionsRan).is.equalTo([ 'A', 'B' ]);
  });

  test('retries a failed function.', async (): Promise<void> => {
    await retryIgnoreAbort(
      [
        getFunction({ name: 'A', successOnRun: 2 }),
        getFunction({ name: 'B', successOnRun: 1 })
      ],
      async (): Promise<'retry'> => 'retry'
    );

    assert.that(functionsRan).is.equalTo([ 'A', 'A', 'B' ]);
  });

  test('ignores a failed function.', async (): Promise<void> => {
    await retryIgnoreAbort(
      [
        getFunction({ name: 'A', successOnRun: 2 }),
        getFunction({ name: 'B', successOnRun: 1 })
      ],
      async (): Promise<'ignore'> => 'ignore'
    );

    assert.that(functionsRan).is.equalTo([ 'A', 'B' ]);
  });

  test('aborts on a failed function.', async (): Promise<void> => {
    await assert.that(async (): Promise<void> => {
      await retryIgnoreAbort(
        [
          getFunction({ name: 'A', successOnRun: 2 }),
          getFunction({ name: 'B', successOnRun: 1 })
        ],
        async (): Promise<'abort'> => 'abort'
      );
    }).is.throwingAsync('Error in function A.');

    assert.that(functionsRan).is.equalTo([ 'A' ]);
  });
});
