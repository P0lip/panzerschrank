import clone from 'src/clone';
import Serializers from 'src/serializers';
import array from 'src/serializers/array';
import { compare } from 'jest/helpers';

class CustomClass {}

describe('Clone', () => {
  test('clones properly', () => {
    compare([
      {},
      { foo: true, x: 1.0 },
      { bar: 'test' },
      { c: true, x: 1 },
    ]);
  });
});
