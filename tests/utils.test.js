import {
  toArray,
  isObject,
  isObjectLiteral,
  isNativeFunction,
  isPrimitive,
  hasMonkeyPatchedProp,
  assert,
  getType,
  isNativeDescriptor
} from 'src/utils';
import { isAsyncFunction } from '../src/utils';

describe('#isObject', () => {
  test('returns true if object is passed', () => {
    expect(isObject(new Map())).toBe(true);
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
  });

  test('returns false if null/undefined is passed', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject()).toBe(false);
  });

  test('returns false if object isn\'t passed', () => {
    expect(isObject(() => {})).toBe(false);
    expect(isObject(false)).toBe(false);
    expect(isObject(2)).toBe(false);
    expect(isObject('test')).toBe(false);
    expect(isObject(Symbol('test'))).toBe(false);
  });
});

describe('#isObjectLiteral', () => {
  test('returns true if object literal is passed', () => {
    expect(isObjectLiteral({})).toBe(true);
    const obj = {
      get [Symbol.toStringTag]() {
        return 'Wrong String Tag';
      },
    };

    expect(isObjectLiteral(obj)).toBe(true);
  });

  test('returns false if object literal isn\'t passed', () => {
    expect(isObjectLiteral(null)).toBe(false);
    expect(isObjectLiteral(new WeakSet())).toBe(false);
    expect(isObjectLiteral(Promise)).toBe(false);
    expect(isObjectLiteral([])).toBe(false);
    expect(isObjectLiteral()).toBe(false);
    expect(isObjectLiteral(false)).toBe(false);
  });
});

describe('#isPrimitive', () => {
  test('returns false if non-primitive passed', () => {
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive({})).toBe(false);
  });

  test('returns true if primitive passed', () => {
     expect(isPrimitive(2)).toBe(true);
     expect(isPrimitive(false)).toBe(true);
     expect(isPrimitive('hehe')).toBe(true);
     expect(isPrimitive(Symbol('uuu'))).toBe(true);
     expect(isPrimitive()).toBe(true);
     expect(isPrimitive(null)).toBe(true);
   });
});

describe('#isNativeFunction', () => {
  test('returns true if function is native', () => {
    expect(isNativeFunction(Array.prototype.forEach)).toBe(true);
    expect(isNativeFunction(Array.prototype.toString)).toBe(true);
    expect(isNativeFunction(Function.prototype.constructor)).toBe(true);
    expect(isNativeFunction(Object.keys)).toBe(true);
    expect(isNativeFunction(Object.keys.bind(Object))).toBe(true);
  });

  test('returns false if function isn\'t native', () => {
    expect(isNativeFunction(() => {})).toBe(false);
  });
});

describe('#isAsyncFunction', () => {
  test('returns true if function is async', () => {
    expect(isAsyncFunction(async () => {})).toBe(true);
  });

  test('returns false if function is async', () => {
     expect(isAsyncFunction(() => {})).toBe(false);
     expect(isAsyncFunction(Function.prototype.toString)).toBe(false);
   });
})

describe('#assert', () => {
  test('throws on false condition', () => {
    expect(() => assert(false)).toThrow();
  });

  test('doesn\'t throw on true condition', () => {
    expect(() => assert(true)).not.toThrow();
  });
});

describe('#hasMonkeyPatchedProp', () => {
  test('returns true when some of passed prop is monkey-patched', () => {
    const arr = [];
    arr[Symbol.iterator] = () => {};
    expect(hasMonkeyPatchedProp(arr, [Symbol.iterator])).toBe(true);
  });

  test('returns false when none of passed prop is monkey-patched', () => {
    expect(hasMonkeyPatchedProp([], [Symbol.iterator])).toBe(false);
    expect(hasMonkeyPatchedProp([], ['map'])).toBe(false);
    expect(hasMonkeyPatchedProp([], Object.getOwnPropertyNames(Array.prototype))).toBe(false);
   });
});

describe('#getType', () => {
  describe('NativeFunction', () => {
    expect(getType(Function.constructor)).toBe('NativeFunction');
    expect(getType(() => {})).not.toBe('NativeFunction');
  });
});

