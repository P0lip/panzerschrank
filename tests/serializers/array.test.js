import Serializers from 'src/serializers';
import array from 'src/serializers/array';
import { compare } from 'jest/helpers';

const serializers = new Serializers();
serializers.registerSerializers(array);

describe('Array serializer', () => {
  test('clones properly', () => {
    compare([
      { c: true, arr: [2, 3] },
      { arr: new Uint8Array(1) },
    ]);
  });
});
