import Serializers from 'src/serializers';
import date from 'src/serializers/date';
import { compare } from 'jest/helpers';

const serializers = new Serializers();
serializers.registerSerializers(date);

describe('Date serializer', () => {
  test('clones properly', () => {
    compare([
      { c: true, arr: new Date() },
    ]);
  });
});
