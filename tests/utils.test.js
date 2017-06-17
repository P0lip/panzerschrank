import {
  toArray,
  isObject,
  isObjectLiteral,
  isNative,
  hasMonkeyPatchedProp,
  assert,
} from '../src/utils';

test('isObject() returns true if object is passed', () => {
  expect(isObject(new Map())).toBe(true);
  expect(isObject({})).toBe(true);
  expect(isObject([])).toBe(true);
});

test('isObject() returns false if null is passed', () => {
  expect(isObject(null)).toBe(false);
});

test('isObject() returns false if object isn\'t passed', () => {
  expect(isObject()).toBe(false);
  expect(isObject(() => {})).toBe(false);
  expect(isObject(false)).toBe(false);
});

test('isObjectLiteral() returns true if object literal is passed', () => {
  expect(isObjectLiteral({})).toBe(true);
  const obj = {
    get [Symbol.toStringTag]() {
      return 'Wrong String Tag';
    },
  };

  expect(isObjectLiteral(obj)).toBe(true);
});

test('isObjectLiteral() returns false if object literal isn\'t passed', () => {
  expect(isObjectLiteral(null)).toBe(false);
  expect(isObjectLiteral(new WeakSet())).toBe(false);
  expect(isObjectLiteral(Promise)).toBe(false);
  expect(isObjectLiteral([])).toBe(false);
  expect(isObjectLiteral()).toBe(false);
  expect(isObjectLiteral(false)).toBe(false);
});

test('toArray() returns an array if iterable is passed', () => {
  expect(toArray([])).toEqual([]);
  expect(toArray(new Map([['test', true]]).keys())).toEqual(['test']);
});

test('toArray() throws when monkey-patched iterable is passed', () => {
  const arr = [];
  arr[Symbol.iterator] = function* () {
    yield;
  };

  try {
    toArray(arr);
  } catch (ex) {
    expect(ex).toBeInstanceOf(TypeError);
  }
});

test('isNative() returns true if function is native', () => {
  expect(isNative(Array.prototype.forEach)).toBe(true);
  expect(isNative(Object.keys)).toBe(true);
  expect(isNative(Object.keys.bind(Object))).toBe(true);
});

test('isNative() returns false if function isn\'t native', () => {
  expect(isNative(() => {})).toBe(false);
});

test('assert() throws', () => {
  expect(() => assert(false)).toThrow();
});

test('hasMonkeyPatchedProp() works', () => {
  let arr = [];
  arr.test = 2;
  expect(hasMonkeyPatchedProp(arr)).toBe(false);
  arr = [];
  arr.push = () => {};
  expect(hasMonkeyPatchedProp(arr)).toBe(true);
  expect(hasMonkeyPatchedProp([])).toBe(false);
  expect(hasMonkeyPatchedProp([0])).toBe(false);
  // todo: add sth with delete
  arr = [];
  arr.push = arr.splice;
  expect(hasMonkeyPatchedProp(arr)).toBe(true);
  arr.push = [].push;
  expect(hasMonkeyPatchedProp(arr)).toBe(false);
});
