import vault from '../../src/index';
import Serializers from '../../src/serializers';
import array from '../../src/serializers/array';
import object from '../../src/serializers/object';
import compare from '../../src/diff';

const serializers = new Serializers();
serializers.registerSerializers(array);
serializers.registerSerializers(object);

test('clones properly', () => {
  [
    { x: true, obj: { x: [2] }, a: { x: true, foo: 2 } },
    { c: true, arr: [2, 3] },
    { arr: new Uint8Array(1) },
  ].forEach(obj => compare(vault(obj, serializers), obj));
});

test('mutates properly', () => {
  const arr = [2, 3];
  const cloned = vault({ c: true, arr: arr.slice() }, serializers);
  cloned.arr.map((elem, n) => expect(elem).toEqual(arr[n]));
  expect(cloned.arr.pop()).toBe(3);
  expect(cloned.arr.pop()).toBe(3);
  expect(cloned.arr.shift()).toBe(2);
  cloned.arr.map((elem, n) => expect(elem).toEqual(arr[n]));
  expect(cloned.arr).toHaveLength(2);
  cloned(obj => {
    obj.arr.push(4);
  });
  cloned.arr.map((elem, n) => expect(elem).toEqual([...arr, 4][n]));
  expect(cloned.arr).toHaveLength(3);
});
