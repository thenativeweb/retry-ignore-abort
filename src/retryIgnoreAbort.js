'use strict';

const retryIgnoreAbort = async function (fns, onRetryIgnoreAbort) {
  if (!fns) {
    throw new Error('Functions are missing.');
  }
  if (!onRetryIgnoreAbort) {
    throw new Error('Handler is missing.');
  }

  for (const fn of fns) {
    let retry;

    do {
      retry = false;

      try {
        await fn();
      } catch (ex) {
        const result = await onRetryIgnoreAbort(ex);
        const selection = result.toLowerCase();

        switch (selection) {
          case 'retry': {
            retry = true;
            break;
          }
          case 'ignore': {
            // Ignore the exception, and continue with the next iteration.
            break;
          }
          case 'abort': {
            throw ex;
          }
          default: {
            throw ex;
          }
        }
      }
    } while (retry);
  }
};

module.exports = retryIgnoreAbort;
