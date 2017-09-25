import sandbox from 'src/sandbox';

describe('Sandbox', () => {
  test('executes function', () => {
    expect(sandbox(function () {
      return 5;
    })).toBe(5);

    expect(sandbox(() => 5)).toBe(5);

    expect(sandbox(function test() {
      return 5;
    })).toBe(5);
  });

  test('executes async function', async () => {
    const result = await sandbox(async () => {
      await Promise.resolve(10);
      return 5;
    }, []);
    expect(result).toBe(5);
  })

  test('recurrence is possible', () => {
    expect(sandbox(function test(i = 0) {
      if (i === 2) return true;
      return test(i + 1);
    }), []).toBe(true);
  });

  test('has a separated scope', () => {
    expect(() => sandbox(() => {
      console.log();
    })).toThrow(ReferenceError)

    const d = 5;
    expect(() => sandbox(() => {
      d;
    })).toThrow(ReferenceError);
  });

  test('accepts custom arguments', () => {
    expect(sandbox(d => d[1], [[2, 4]])).toEqual(4);
    expect(sandbox(d => d[0], [[2, 4]])).toEqual(2);
    expect(sandbox(({ foo, bar }) => foo + bar, [{ foo: 2, bar: 5 }])).toBe(7);
    expect(sandbox((foo, bar) => foo + bar, ['foo', 'bar'])).toBe('foobar');
  });

  test('sandbox doesnt\'t leak references', () => {
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
    expect(() => sandbox((d = x) => d)).toThrow(ReferenceError);

    expect(sandbox(function (d) {
      arguments[0] = 2;
      return arguments[0];
    }, [5])).toEqual(2);
  });

  test('dereferences custom arguments', () => {
    const arr = [2];
    sandbox(d => {
      d.push(4);
    }, [arr]);
    expect(arr).toEqual([2]);
    sandbox(d => {
      d.pop();
    }, [arr]);
    expect(arr).toEqual([2]);

    const foo = {};
    const bar = { x: true };
    sandbox((obj, obj2) => {
      obj.a = obj2;
    }, [foo, bar]);
    expect(foo.a).toBeUndefined();
    bar.x = false;
    expect(foo.a).not.toEqual(bar);

    let y = 4;
    sandbox((d, c) => c(d), [10, (x) => { y = x }]);
    expect(y).toBe(4);
  });

  test('nested sandboxing', () => {
    expect(() => sandbox(() => {
      (() => x)();
    }, [])).toThrow();
  });
});
