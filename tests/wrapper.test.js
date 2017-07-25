import proxy from '../src/wrapper'
import Serializers from '../src/serializers';
import array from '../src/serializers/array';

const mySerializers = new Serializers();
mySerializers.registerSerializers(array);

describe('Wrapper', () => {
  test('gets value', () => {
    const arr = proxy([0, 1], mySerializers.getSerializer([]));
    expect(arr.value).toEqual([0, 1]);
    arr.value.push(2);
    expect(arr.value).toEqual([0, 1]);
    arr.value.pop();
    expect(arr.value).toEqual([0, 1]);
  });

  test('proper instanceof', () => {
    const arr = proxy([0, 1], mySerializers.getSerializer([]));
    expect(arr.value).toBeInstanceOf(Array);
  });

  test('proper constructor', () => {
    const arr = proxy([0, 1], mySerializers.getSerializer([]));

  })

  test('sets a new value', () => {
    const arr = proxy([0, 1], mySerializers.getSerializer([]));
    arr.value = [0];
    expect(arr.value).toEqual([0]);
  })
});
