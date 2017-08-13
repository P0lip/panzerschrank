import Serializers from 'src/serializers';
import regexp from 'src/serializers/regexp';
import { compare } from 'jest/helpers';

const serializers = new Serializers();
serializers.registerSerializers(regexp);

class CustomRegExp extends RegExp {
  [Symbol.replace]() {
    return '';
  }

  static get implements() {

  }
}

describe('RegExp serializer', () => {
  test('clones properly', () => {
    compare([
      { c: true, reg: /22/ },
      { reg: /323232/ },
      { reg: new RegExp() },
      // { reg: new CustomRegExp() },
    ], serializers);
  });
});


