'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var retryIgnoreAbort = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(fns, onRetryIgnoreAbort) {
    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn, retry, result, selection;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (fns) {
              _context.next = 2;
              break;
            }

            throw new Error('Functions are missing.');

          case 2:
            if (onRetryIgnoreAbort) {
              _context.next = 4;
              break;
            }

            throw new Error('Handler is missing.');

          case 4:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 7;
            _iterator = (0, _getIterator3.default)(fns);

          case 9:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 36;
              break;
            }

            fn = _step.value;
            retry = void 0;

          case 12:
            retry = false;

            _context.prev = 13;
            _context.next = 16;
            return fn();

          case 16:
            _context.next = 32;
            break;

          case 18:
            _context.prev = 18;
            _context.t0 = _context['catch'](13);
            _context.next = 22;
            return onRetryIgnoreAbort(_context.t0);

          case 22:
            result = _context.sent;
            selection = result.toLowerCase();
            _context.t1 = selection;
            _context.next = _context.t1 === 'retry' ? 27 : _context.t1 === 'ignore' ? 29 : _context.t1 === 'abort' ? 30 : 31;
            break;

          case 27:
            retry = true;
            return _context.abrupt('break', 32);

          case 29:
            return _context.abrupt('break', 32);

          case 30:
            throw _context.t0;

          case 31:
            throw _context.t0;

          case 32:
            if (retry) {
              _context.next = 12;
              break;
            }

          case 33:
            _iteratorNormalCompletion = true;
            _context.next = 9;
            break;

          case 36:
            _context.next = 42;
            break;

          case 38:
            _context.prev = 38;
            _context.t2 = _context['catch'](7);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 42:
            _context.prev = 42;
            _context.prev = 43;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 45:
            _context.prev = 45;

            if (!_didIteratorError) {
              _context.next = 48;
              break;
            }

            throw _iteratorError;

          case 48:
            return _context.finish(45);

          case 49:
            return _context.finish(42);

          case 50:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[7, 38, 42, 50], [13, 18], [43,, 45, 49]]);
  }));

  return function retryIgnoreAbort(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = retryIgnoreAbort;