import { assert } from 'assertthat';
import { retry } from '../../lib/retry';

const sleep = async (milliseconds: number): Promise<void> => new Promise((resolve): void => {
  setTimeout(resolve, milliseconds);
});

suite('retry', function (): void {
  this.timeout(5_000);

  test('resolves to the value the retry operation returns.', async (): Promise<void> => {
    const result = await retry(async (bail, num): Promise<string> => {
      if (num < 2) {
        throw new Error('foo');
      }

      await sleep(50);

      return `bar ${num}`;
    });

    assert.that(result).is.equalTo('bar 2');
  });

  test('calling bail stops the retry process.', async (): Promise<void> => {
    try {
      await retry(
        async (bail, num): Promise<void> => {
          if (num === 2) {
            bail(new Error('Wont retry'));
          }

          throw new Error(`Test ${num}`);
        },
        { retries: 3 }
      );
    } catch (error) {
      assert.that(error.message).is.equalTo('Wont retry');
    }
  });

  test('setting the bail property on a thrown error stops the retry process.', async (): Promise<void> => {
    let retries = 0;

    try {
      await retry(
        async (): Promise<void> => {
          retries += 1;
          await sleep(100);
          const err = new Error('Wont retry') as any;

          err.bail = true;
          throw err;
        },
        { retries: 3 }
      );
    } catch (error) {
      assert.that(error.message).is.equalTo('Wont retry');
    }

    assert.that(retries).is.equalTo(1);
  });

  test('works with a synchronous operation.', async (): Promise<void> => {
    const result = await retry((): number => 5);

    assert.that(result).is.equalTo(5);
  });

  test('throwing an error works with a synchronous operation.', async function (): Promise<void> {
    this.timeout(10_000);

    try {
      await retry(
        (bail, num): void => {
          throw new Error(`Test ${num}`);
        },
        { retries: 2 }
      );
    } catch (error) {
      assert.that(error.message).is.equalTo('Test 3');
    }
  });

  test('works with multiple retries.', async function (): Promise<void> {
    this.timeout(10_000);

    let retries = 0;

    try {
      await retry(
        (): void => {
          throw new Error(`Test ${retries}`);
        },
        {
          retries: 2,
          onRetry (err, i): void {
            if (err) {
              /* eslint-disable no-console */
              console.log(`Retry error : ${err.message}`);
              /* eslint-enable no-console */
            }

            retries = i;
          }
        }
      );
    } catch (error) {
      assert.that(retries).is.equalTo(2);
    }
  });

  test(`retries can't overtake each other.`, async function (): Promise<void> {
    this.timeout(10_000);

    const resolveOrder: number[] = [];

    await retry(
      async (bail, retryCount): Promise<void> => {
        if (retryCount === 1) {
          await new Promise((resolve): void => {
            setTimeout(resolve, 5_000);
          });
        }

        resolveOrder.push(retryCount);
      }
    );

    assert.that(resolveOrder).is.equalTo([ 1 ]);
  });
});
