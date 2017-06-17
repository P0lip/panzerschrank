import clone from '../src/clone';
import Serializers from '../src/serializers';
import array from '../src/serializers/array';
import compare from './compare';

test('clones properly', () => {
  [
    {},
    { foo: true, x: 1.0 },
    { bar: 'test' },
    { c: true, x: 1 },
  ].forEach(obj => {
    compare(clone(obj), obj);
  });
});

test('triggers serializers', () => {
  const serializers = new Serializers();
  expect(clone({ foo: true, y: [] }, serializers).y).toBe(null);
  serializers.registerSerializers(array);
  expect(clone({ foo: true, y: [2] }, serializers).y.value).toEqual([2]);
  const cloned = clone({ foo: true, y: [2] }, serializers);
  cloned.y.value = [2, 3];
  expect(cloned.y.value).toEqual([2, 3]);
});
