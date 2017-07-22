import Serializers from '../src/serializers';
import array from '../src/serializers/array';

test('registers serializer', () => {
  const serializers = new Serializers();
  serializers.registerSerializer({ constructor: Array, serializer(arr) { return arr; } });
  expect(serializers.getSerializer([1])).not.toThrow();
});

test('registers serializers', () => {
  const serializers = new Serializers();
  serializers.registerSerializers([
    { constructor: Array, serializer() {} },
    { constructor: Date, serializer() {} },
  ]);
  expect(serializers.getSerializer([1])).not.toThrow();
  expect(serializers.getSerializer(new Date())).not.toThrow();
});

test('gets serializer', () => {
  const serializers = new Serializers();
  serializers.registerSerializers(array);
  expect(() => serializers.getSerializer([1])([])).not.toThrow();
  expect(() => serializers.getSerializer(new Uint8Array(2))(new Uint8Array(2))).not.toThrow();
});

test('getting serializer should fail in some cases', () => {
  const serializers = new Serializers();
  serializers.registerSerializers(array);
  const arr = [];
  arr.push = () => {};
  expect(() => serializers.getSerializer(arr)).toThrow();
});

test('deletes serializer', () => {
  const serializers = new Serializers();
  serializers.registerSerializer({ constructor: Array, serializer(arr) { return arr; } });
  expect(serializers.getSerializer([1])).not.toThrow();
  serializers.removeSerializer(Array);
  expect(() => serializers.getSerializer([1])()).toThrow();
});

test('handles misses', () => {
  const serializers = new Serializers();
  serializers.getSerializer([1]);
  expect(serializers.getSerializer([1])).toBe(undefined);
  expect(serializers.missed.has(Array)).toBe(true);
  serializers.registerSerializers(array);
  expect(serializers.missed.has(Array)).toBe(false);
});
