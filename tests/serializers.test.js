import Serializers from '../src/serializers';
import array from 'src/serializers/array';
import date from 'src/serializers/date';

describe('Serializers', () => {
  test('registers serializers', () => {
    let serializers = new Serializers();
    serializers.add(date);
    serializers = new Serializers(date);
  });

  test('gets serializer', () => {

  });

  test('returns generic', () => {

  });
});
