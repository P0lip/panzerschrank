import { isNonPrimitive } from './utils';
import Serializers from './serializers';
import knownSerializers from './serializers/index';
import Wrapper from './wrapper';

export const internal = Symbol('internal');

const defaultSerializers = new Serializers();
defaultSerializers.registerSerializers(knownSerializers);

export default (prev, serializers = defaultSerializers) => {
  if (isNonPrimitive(prev) === false) return prev;
  const keys = Object.keys(prev);
  if (keys.length === 0) return {};
  const next = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (isNonPrimitive(prev[key]) === false) {
      const wrapped = new Wrapper(
        prev[key],
        serializers !== void 0 && serializers.getSerializer(prev[key]),
      );

      Object.defineProperty(next, key, {
        configurable: true,
        enumerable: true,
        writable: true,
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
