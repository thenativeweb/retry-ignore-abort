import { errors } from './errors';
import { promisify } from 'util';
import { retryIgnoreAbort } from './retryIgnoreAbort';

const sleep = promisify(setTimeout);

export interface RetryOptions {
  retries: number;
  minTimeout: number;
  maxTimeout: number;
  factor: number;
}

export type RetryOperation<TValue> = (retryCount: number) => Promise<TValue> | TValue;

const defaultRetryOptions: RetryOptions = {
  retries: 5,
  minTimeout: 1_000,
  maxTimeout: 60_000,
  factor: 2
};

const retry = async function <TValue>(
  retryOperation: RetryOperation<TValue>,
  optionsWithoutDefaults: Partial<RetryOptions> = defaultRetryOptions
): Promise<TValue | undefined> {
  const options = {
    ...defaultRetryOptions,
    ...optionsWithoutDefaults
  };

  if (options.maxTimeout < options.minTimeout) {
    throw new errors.OptionsInvalid('Max timeout must be greate than min timeout.');
  }

  let timeout = options.minTimeout;
  let currentRetry = 0;
  let result: TValue | undefined;

  const wrappedFn = async (): Promise<TValue> => {
    result = await retryOperation(currentRetry);

    return result;
  };

  await retryIgnoreAbort(
    [ wrappedFn ],
    async (ex): Promise<'retry'> => {
      currentRetry += 1;
      if (currentRetry > options.retries) {
        throw new errors.RetriesExceeded('Retried too many times.', { data: { ex }});
      }

      await sleep(timeout);

      timeout = Math.min(timeout * options.factor, options.maxTimeout);

      return 'retry';
    }
  );

  return result;
};

export {
  retry
};
