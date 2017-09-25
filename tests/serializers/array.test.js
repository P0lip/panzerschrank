import serializers from 'src/serializers/array';

const [array] = serializers;

describe('Array serializer', () => {
  test('matches instance', () => {
    expect(new Uint8Array(0) instanceof array).toBe(true);
    expect(new Float64Array(0) instanceof array).toBe(true);
    expect([] instanceof array).toBe(true);
    expect(new Array() instanceof array).toBe(true);
    expect(new class x extends Array {} instanceof array).toBe(true);
  });

  test('clones properly', () => {
    const arr = [2];
    const tArr = new Float64Array(2);
    expect(array.serializer(arr)).not.toBe(arr);
    expect(array.serializer(arr)).toEqual(arr);
    expect(array.serializer(tArr)).not.toBe(tArr);
    expect(array.serializer(tArr)).toEqual(tArr);
    expect(new (class extends Array {})(2)).toEqual([,,]);
  });
});

