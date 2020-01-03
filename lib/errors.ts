import { defekt } from 'defekt';

const errors = defekt({
  OptionsInvalid: {},
  RetriesExceeded: {}
});

export {
  errors
};
