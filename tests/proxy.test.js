import proxy from '../src/proxy'
import Serializers from '../src/serializers';
import array from '../src/serializers/array';

const mySerializers = new Serializers();
mySerializers.registerSerializers(array);

describe('Proxy', () => {
  test('works', () => {
    const arr = proxy([0, 1], mySerializers);
    expect(arr).toEqual([0, 1]);
    const newArr = arr.push(2);
    expect(arr).toEqual([0, 1]);
    expect(newArr).toEqual([0, 1, 2]);
    const newArr2 = newArr.push(2);
    expect(newArr).toEqual([0, 1, 2]);
    expect(newArr2).toEqual([0, 1, 2, 2]);
  });
});
