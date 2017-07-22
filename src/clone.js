import { isNonPrimitive, isObject } from './utils';
import Serializers from './serializers';
import knownSerializers from './serializers/index';
import Wrapper from './wrapper';
import GenericWrapper from './generic';

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
    if (isObject(prev[key]) === true) {
      const adapter = serializers !== void 0 && serializers.getSerializer(prev[key]);
      const wrapped = typeof adapter !== 'function' ?
        new Wrapper(prev[key], adapter, serializers) :
        new GenericWrapper(prev[key]);

      Object.defineProperty(next, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        get() {
          if (this[internal].mutable === true) {
            return wrapped.ref;
          }

          return wrapped.value;
        },
      });
    } else {
      next[key] = prev[key];
    }
  }

  return next;
};
