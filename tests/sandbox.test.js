import sandbox from '../src/sandbox';

test('sandbox evaluates func', () => {
  expect(sandbox(function () {
    return 5;
  })).toBe(5);

  expect(sandbox(() => 5)).toBe(5);
  expect(sandbox(function test() {
    return 5;
  })).toBe(5);
});

test('sandbox has a separated scope', () => {
  try { // .toThrow doesn't work as expected
    sandbox(() => {
      console.log();
    });
  } catch (ex) {
    expect(ex).toBeInstanceOf(TypeError);
  }
  try { // .toThrow doesn't work as expected
    const d = 5;
    sandbox(() => {
      return d;
    });
  } catch (ex) {
    expect(ex).toBeInstanceOf(TypeError);
  }
});

test('sandbox accepts custom arguments', () => {
  expect(sandbox(d => d, [[2, 4]])).toEqual([2, 4]);
  expect(sandbox(({ foo, bar }) => foo + bar, [{ foo: 2, bar: 5 }])).toBe(7);
  expect(sandbox((foo, bar) => foo + bar, ['foo', 'bar'])).toBe('foobar');
});

test('sandbox handles arguments correctly', () => {
  expect(sandbox(d => {
    d = 4;
    return 4;
  }, [2])).toEqual(4);
  expect(sandbox(function (d) {
    arguments[0] = 2;
    return d;
  }, [5])).toEqual(2);
  expect(sandbox(function (d) {
    'use strict';
    arguments[0] = 2;
    return d;
  }, [5])).toEqual(5);
  const x = 2;
  expect(sandbox(function (d = x) {
    return d;
  })).toBe(undefined);
  expect(sandbox(function (d) {
    arguments[0] = 2;
    return arguments[0];
  }, [5])).toEqual(2);
});
