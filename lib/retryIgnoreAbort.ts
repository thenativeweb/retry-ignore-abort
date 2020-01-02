const retryIgnoreAbort = async function (
  fns: (() => (Promise<any> | any))[],
  onRetryIgnoreAbort: (ex: Error) => Promise<'retry' | 'ignore' | 'abort'>
): Promise<void> {
  for (const fn of fns) {
    let retry;

    do {
      retry = false;

      try {
        await fn();
      } catch (ex) {
        const selection = await onRetryIgnoreAbort(ex);

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

export {
  retryIgnoreAbort
};
