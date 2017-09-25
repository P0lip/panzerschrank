import { isObjectLiteral } from './utils';
import Serializers from './serializers';

export const internal = Symbol('internal');

export const getDescriptor = (initial, serializers = new Serializers(), context) => {
  const serializer = serializers.get(initial);
  let value = serializer(initial, serializers, context);

  return {
    configurable: true,
    enumerable: true,
    get() {
      return serializer(value, serializers, context);
    },

    set(newValue) {
      if (context.mutable) {
        value = serializer(newValue, serializers, context);
        return true;
      }
      return false;
    },
  };
};

export default (prev, ...args) => {
  const next = {};
  if (isObjectLiteral(prev)) {
    for (const key of Reflect.ownKeys(prev)) {
      Object.defineProperty(next, key, getDescriptor(prev[key], ...args));
    }
  }

  return next;
};
