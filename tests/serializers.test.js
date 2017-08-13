import Serializers from '../src/serializers';
import array from 'src/serializers/array';
import date from 'src/serializers/date';

describe('Serializers', () => {
  test('registers serializer', () => {
    const serializers = new Serializers();
    serializers.registerSerializer(array[0]);
    expect(() => serializers.getSerializer([1])([1])).not.toThrow();
  });

  test('registers serializers', () => {
    const serializers = new Serializers();
    serializers.registerSerializers([...array, ...date]);
    expect(() => serializers.getSerializer([1])([1])).not.toThrow();
    expect(() => serializers.getSerializer(new Date())(new Date())).not.toThrow();
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
    serializers.registerSerializers([...array, ...date]);
    expect(() => serializers.getSerializer([1])([1])).not.toThrow();
    expect(() => serializers.getSerializer(new Date())(new Date())).not.toThrow();
    serializers.removeSerializer([]);
    expect(() => serializers.getSerializer([1])()).toThrow();
    expect(() => serializers.getSerializer(new Uint8Array(0))(new Uint8Array(0))).not.toThrow();
  });
});
