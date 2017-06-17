import index from '../src/index';

test('it works <3', () => {
  const obj = { foo: 'bar', bar: false, lelz: 'true' };
  const instance = index(obj);
  expect(instance.foo).toBe('bar');

  instance(map => {
    map.foo = 2;
  });

  expect(instance.foo).toBe(2);

  instance(map => {
    delete map.foo;
  });

  expect(instance.foo).toBeUndefined();
});
