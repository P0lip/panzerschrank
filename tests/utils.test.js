import {
  toArray,
  isObject,
  isObjectLiteral,
  isNative,
  isPrimitive,
  hasMonkeyPatchedProp,
  assert,
  getType,
} from 'src/utils';

describe('#isObject', () => {
  test('returns true if object is passed', () => {
    expect(isObject(new Map())).toBe(true);
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
  });

  test('returns false if null is passed', () => {
    expect(isObject(null)).toBe(false);
  });

  test('returns false if object isn\'t passed', () => {
    expect(isObject()).toBe(false);
    expect(isObject(() => {})).toBe(false);
    expect(isObject(false)).toBe(false);
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

describe('#isNative', () => {
  test('returns true if function is native', () => {
    expect(isNative(Array.prototype.forEach)).toBe(true);
    expect(isNative(Object.keys)).toBe(true);
    expect(isNative(Object.keys.bind(Object))).toBe(true);
  });

  test('returns false if function isn\'t native', () => {
    expect(isNative(() => {})).toBe(false);
  });
});

describe('#assert', () => {
  test('throws on false condition', () => {
    expect(() => assert(false)).toThrow();
  });

  test('doesn\'t throw on true condition', () => {
    expect(() => assert(true)).not.toThrow();
  });
});

describe('#hasMonkeyPatchedProp', () => {
  test('returns true when none of passed prop is monkey-patched', () => {
    const arr = [];
    arr[Symbol.iterator] = () => {};
    expect(hasMonkeyPatchedProp(arr, [Symbol.iterator])).toBe(true);
  });

  test('returns false when none of passed prop is monkey-patched', () => {
    expect(hasMonkeyPatchedProp([], [Symbol.iterator])).toBe(false);
  })
});

describe('#getType', () => {
  describe('NativeFunction', () => {
    expect(getType(Function.constructor)).toBe('NativeFunction');
    expect(getType(() => {})).not.toBe('NativeFunction');
  });
});

