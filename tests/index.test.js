import vault from 'src/index';
import AccessError from 'src/error';

describe('Vault', () => {
  test('get trap', () => {
    const instance = vault({ foo: 'bar', bar: false, arr: [0, 1] });
    expect(instance.foo).toBe('bar');
    expect(instance.bar).toBe(false);
    expect(instance.arr).toEqual([0, 1]);
    expect(instance.arr === instance.arr).toBe(false);
    expect(instance.arr.pop() === instance.arr.pop()).toBe(true);
    expect(instance.arr).toEqual([0, 1]);
  });

  test('Symbol.iterator', () => {
    let called = 0;
    const keys = ['foo', 'bar', 'test']
    const values = ['bar', false, JSON.parse(JSON.stringify(new Date(0)))];
    for (const [key, value] of vault({ foo: 'bar', bar: false, test: new Date(0) })) {
      expect(key).toBeDefined();
      expect(key).toBe(keys[called]);
      expect(value).toBeDefined();
      expect(value).toEqual(values[called]);
      called++;
    }
    expect(called).toBe(3);
    // todo: check how immutability works here
  });

  test('Symbol.toStringTag', () => {
    expect(
      {}.toString.call(vault({ foo: 'bar', bar: false, test: new Date() }))
    ).toBe('[object Vault]');
  });

  test('set trap', () => {
    const instance = vault({ foo: 'bar', bar: false, arr: [0, 1] });

    expect(() => {
      instance.foo = 4;
    }).toThrow();
    expect(instance.foo).toBe('bar');

    const str = 2;
    expect(() => {
      instance(obj => {
        obj.newProp = str;
      });
    }).toThrow();
    expect(instance.newProp).toBe(void 0);

    expect(() => {
      instance((obj, str) => {
        obj.newProp = str;
      }, str);
    }).not.toThrow();

    instance(obj => {
      obj.foo = 2;
    });
    expect(instance.foo).toBe(2);
    instance(obj => {
      obj.foo = [];
    });
    expect(instance.foo).toEqual([]);

    instance(obj => {
      obj.newProp = {};
    });
    expect(instance.newProp).toEqual({});
    instance(obj => {
      obj.newProp = [];
    });
    expect(instance.newProp).toEqual([]);
  });

  test('nested set trap', () => {
    const instance = vault({ foo: { bar: false } });
    expect(instance.foo.bar).toBe(false);
    instance(obj => {
      obj.foo.bar = true;
    });
    expect(instance.foo.bar).toBe(true);
  });

  test('delete trap', () => {
    const instance = vault({ test: 2 });

    expect(() => {
      delete instance.test;
    }).toThrow();
    expect(instance.test).toBe(2);

    instance(map => {
      delete map.test;
    });

    expect(instance.test).toBeUndefined();
  });

  test('defineProperty trap', () => {
    const instance = vault({ test: 2 });
    expect(() => Object.defineProperty(instance, 'test', {
      value: 5,
    })).toThrow(AccessError);
    expect(instance.test).not.toBe(5);
    expect(() => Object.defineProperty(instance, 'test2', {
      value: [],
      writable: false,
    })).toThrow(AccessError);
    expect(instance.test2).not.toEqual([]);
  });


  test('ownKeys trap', () => {
    const obj = vault({ foo: 'bar', bar: false, lelz: 'true' });
    expect(Object.getOwnPropertyNames(obj)).toEqual(['prototype']);
    expect(Object.keys(obj)).toEqual([]);
    expect(Object.getOwnPropertySymbols(obj))
      .toEqual([Symbol.iterator, Symbol.hasInstance, Symbol.toStringTag]);
    expect(Reflect.ownKeys(obj))
      .toEqual(['prototype', Symbol.iterator, Symbol.hasInstance, Symbol.toStringTag]);
  })
});
