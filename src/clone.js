import { isObjectLiteral, isPrimitive } from './utils';
import Serializers from './serializers';
import knownSerializers from './serializers/index';
import wrapper from './wrapper';
import vault from './index';

export const internal = Symbol('internal');

const defaultSerializers = new Serializers();
defaultSerializers.registerSerializers(knownSerializers);

export default (prev, serializers = defaultSerializers) => {
  if (isPrimitive(prev) === true) return prev;
  const keys = Object.keys(prev);
  if (keys.length === 0) return {};
  const next = {};
  for (const key of keys) {
    if (isPrimitive(prev[key]) === false) {
      if (isObjectLiteral(prev[key]) === true) {
        return vault(prev[key], serializers);
      }

      const wrapped = wrapper(
        prev[key],
        serializers,
      );

      Object.defineProperty(next, key, {
        configurable: true,
        enumerable: true,
        get() {
          return wrapped.value;
        },
        set(newValue) {
          if (this[internal].mutable === true) {
            wrapped.value = newValue;
            return true;
          }

          return false;
        }
      });
    } else {
      next[key] = prev[key];
    }
  }

  return next;
};
