import { defekt } from 'defekt';

class OptionsInvalid extends defekt({ code: 'OptionsInvalid' }) {}
class RetriesExceeded extends defekt({ code: 'RetriesExceeded' }) {}

export {
  OptionsInvalid,
  RetriesExceeded
};
