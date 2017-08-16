import { isObjectLiteral, isPrimitive } from './utils';
import Serializers from './serializers';
import knownSerializers from './serializers/index';
import wrapper from './wrapper';
import vault from './index';

export const internal = Symbol('internal');

const defaultSerializers = new Serializers();
defaultSerializers.registerSerializers(knownSerializers);

export default (prev, serializers = defaultSerializers, context) => {
  if (isPrimitive(prev) === true) return prev;
  const next = {};
  for (const key of Object.keys(prev)) {
    if (isPrimitive(prev[key]) === false) {
      if (isObjectLiteral(prev[key]) === true) {
        next[key] = vault(prev[key], serializers, context);
      } else {
        const wrapped = wrapper(prev[key], serializers);

        Object.defineProperty(next, key, {
          configurable: true,
          enumerable: true,
          get() {
            return wrapped.value;
          },
          set(newValue) {
            if (this.mutable === true) { // todo: must **always** point to the top-level vault
              wrapped.value = newValue;
              return true;
            }

            return false;
          },
        });
      }
    } else {
      let currentValue = prev[key];
      Object.defineProperty(next, key, {
        configurable: true,
        enumerable: true,
        get() {
          return currentValue;
        },
        set(newValue) {
          if (this.mutable === true) {
            currentValue = newValue;
            return true;
          }

          return false;
        },
      });
    }
  }

  return next;
};
