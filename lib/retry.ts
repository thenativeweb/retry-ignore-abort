import { operation, OperationOptions } from 'retry';

export interface RetryOptions extends OperationOptions {
  randomize?: boolean;
  onRetry?: (err: any, num: number) => Promise<void> | void;
}

export type RetryOperation<TValue> = (bail: (err?: any) => void, retryCount: number) => Promise<TValue> | TValue;

const retry = async function <TValue>(
  fn: RetryOperation<TValue>,
  opts: RetryOptions = {}
): Promise<TValue> {
  return new Promise((resolve, reject): void => {
    const op = operation(opts);

    const bail = (err?: any): void => {
      reject(err ?? new Error('Aborted'));
    };

    const onError = async (err: any, num: number): Promise<void> => {
      if (err.bail) {
        bail(err);

        return;
      }

      const didRetry = op.retry(err);

      if (!didRetry) {
        reject(op.mainError());

        return;
      }

      if (opts.onRetry) {
        await opts.onRetry(err, num);
      }
    };

    /* eslint-disable unicorn/consistent-function-scoping */
    // Disabled due to bug: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/372
    const runAttempt = async (num: number): Promise<void> => {
      try {
        const result = await fn(bail, num);

        resolve(result);
      } catch (error) {
        await onError(error, num);
      }
    };

    op.attempt(runAttempt);
  });
  /* eslint-enable unicorn/consistent-function-scoping */
};

export {
  retry
};
