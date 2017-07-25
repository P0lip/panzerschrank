import Serializers from 'src/serializers';
import object from 'src/serializers/object';
import { compare } from 'jest/helpers';

const serializers = new Serializers();
serializers.registerSerializers(object);

describe('Object serializer', () => {
  test('clones properly', () => {
    compare([
      {},
      { foo: 'bar' },
      { x: true, obj: { x: true }, a: { x: true, foo: 2 } },
      { x: true, obj: { x: false, a: { b: 'ddd' } }, a: { x: true, foo: 2 } },
    ]);
  });
});
