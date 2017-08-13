import { hasMonkeyPatchedProp } from './utils';
import env from './env';

export function generic(sth) {
  try {
    return JSON.parse(JSON.stringify(sth));
  } catch(ex) {
    return null;
  }
}

export default class {
  constructor() {
    this.serializers = new WeakMap();
  }

  registerSerializer({ test, serializer }) {
    test.forEach(constructor => {
      if (env.mode === 'strict' && this.serializers.has(constructor) === true) {
        console.warn('Overwriting already existing constructor');
      }

      this.serializers.set(constructor, serializer);
    });
  }

  registerSerializers(serializers) {
    serializers.forEach(this.registerSerializer, this);
  }

  removeSerializer(constructor) {
    return this.serializers.delete(constructor);
  }

  getSerializer(target) {
    if (env.mode === 'strict' && hasMonkeyPatchedProp(target) === true) {
      throw new TypeError('Target has a monkey patched property');
    }

    return this.serializers.get(target.constructor) ||
      this.serializers.get(Object.getPrototypeOf(target.constructor)) ||
      generic;
  }
}
