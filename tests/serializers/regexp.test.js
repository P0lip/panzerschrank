import Serializers from 'src/serializers';
import regexp from 'src/serializers/regexp';
import { compare } from 'jest/helpers';

const serializers = new Serializers(regexp);

class CustomRegExp extends RegExp {
  static get [Symbol.species]() {
    return RegExp;
  }
}

describe('RegExp serializer', () => {
  test('clones properly', () => {
    compare([
      { c: true, reg: /22/ },
      { reg: /323232/ },
      { reg: new RegExp() },
      { custom: new CustomRegExp() },
    ], serializers);
  });
});


