import { hasMonkeyPatchedProp } from './utils';
import env from './env';

export default class {
  constructor() {
    this.serializers = new Map();
    this.helpers = new Map();
    this.missed = new WeakSet();
  }

  registerSerializer({ constructor, serializer, instance }) {
    if (this.serializers.has(constructor) === true) {
      throw new Error();
    }

    this.serializers.set(constructor, serializer);
    if (instance !== void 0) this.helpers.set(constructor, instance);
    if (this.missed.has(constructor) === true) this.missed.delete(constructor);
  }

  registerSerializers(serializers) {
    serializers.forEach(this.registerSerializer, this);
  }

  removeSerializer(constructor) {
    return this.serializers.delete(constructor);
  }

  getSerializer(target) {
    if (this.missed.has(target.constructor)) return;
    if (env.isStrict === true && hasMonkeyPatchedProp(target) === true) {
      throw new TypeError('Target has a monkey patched property');
    }

    const serializer = this.serializers.get(target.constructor);

    if (serializer === void 0) {
      for (const [constructor, instance] of this.helpers.entries()) {
        if (instance(target) === true) {
          const foundSerializer = this.serializers.get(constructor);
          this.serializers.set(target.constructor, foundSerializer);
          return foundSerializer;
        }
      }

      this.missed.add(target.constructor);
    } else {
      return serializer;
    }
  }
}
