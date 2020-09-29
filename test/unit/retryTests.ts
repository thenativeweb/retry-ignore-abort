import { assert } from 'assertthat';
import { CustomError } from 'defekt';
import { retry } from '../../lib/retry';

const sleep = async (milliseconds: number): Promise<void> => new Promise((resolve): void => {
  setTimeout(resolve, milliseconds);
});

suite('retry', function (): void {
  this.timeout(5_000);

  test('throws an error if the min timeout is greater than the max timeout.', async (): Promise<void> => {
    try {
      await retry(
        (): number => 5,
        {
          minTimeout: 5_000,
          maxTimeout: 1_000
        }
      );
    } catch (ex: unknown) {
      assert.that((ex as CustomError).message).is.equalTo('Max timeout must be greater than min timeout.');
      assert.that((ex as CustomError).code).is.equalTo('EOPTIONSINVALID');
    }
  });

  test('resolves to the value the retry operation returns.', async (): Promise<void> => {
    const result = await retry(async (num): Promise<string> => {
      if (num < 2) {
        throw new Error('foo');
      }

      await sleep(50);

      return `bar ${num}`;
    });

    assert.that(result).is.equalTo('bar 2');
  });

  test('works with a synchronous operation.', async (): Promise<void> => {
    const result = await retry((): number => 5);

    assert.that(result).is.equalTo(5);
  });

  test('throws an error if the retries are exceeded.', async function (): Promise<void> {
    this.timeout(10_000);

    let retries = 0;

    try {
      await retry(
        (): void => {
          retries += 1;
          throw new Error(`Test ${retries}`);
        },
        {
          retries: 2
        }
      );
    } catch (ex: unknown) {
      assert.that((ex as CustomError).message).is.equalTo('Retried too many times.');
      assert.that((ex as CustomError).code).is.equalTo('ERETRIESEXCEEDED');
      assert.that(retries).is.equalTo(3);
    }
  });

  test(`retries can't overtake each other.`, async function (): Promise<void> {
    this.timeout(10_000);

    const resolveOrder: number[] = [];

    await retry(
      async (retryCount): Promise<void> => {
        if (retryCount === 0) {
          await new Promise((resolve): void => {
            setTimeout(resolve, 5_000);
          });
        }

        resolveOrder.push(retryCount);
      }
    );

    assert.that(resolveOrder).is.equalTo([ 0 ]);
  });
});
