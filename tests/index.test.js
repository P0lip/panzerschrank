import vault from 'src/index';

describe('Vault', () => {
  test('get trap', () => {
    const instance = vault({ foo: 'bar', bar: false, arr: [0, 1] });
    expect(instance.foo).toBe('bar');
    expect(instance.bar).toBe(false);
    expect(instance.arr).toEqual([0, 1]);
    //for (const [key, value] of instance) {
    //  expect(key).toBeDefined();
    //  expect(value).toBeDefined();
    //}

    expect(instance.arr === instance.arr).toBe(false);
    expect(instance.arr.pop() === instance.arr.pop()).toBe(true);
    expect(instance.arr).toEqual([0, 1]);
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
    expect(instance.foo).toBe('bar');

    expect(() => {
      instance((obj, str) => {
        obj.newProp = str;
      }, str);
    }).not.toThrow()

    instance(obj => {
      obj.foo = 2;
    });

    expect(instance.foo).toBe(2);
    instance(obj => {
      obj.newProp = {};
    });
    expect(instance.newProp).toEqual({});
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
  })

  test('ownKeys trap', () => {
    const obj = vault({ foo: 'bar', bar: false, lelz: 'true' });
    expect(Object.getOwnPropertyNames(obj)).toEqual(['prototype']);
    expect(Object.keys(obj)).toEqual([]);
    expect(Object.getOwnPropertySymbols(obj)).toEqual([]);
    expect(Reflect.ownKeys(obj)).toEqual(['prototype']);
  })
});
