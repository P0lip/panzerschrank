import clone from './clone';
import Serializers from './serializers';
import { isNonPrimitive } from './utils';
import sandbox from './sandbox';

const internal = Symbol('internal');
const mutable = new WeakSet();

const traps = {
  get(target, prop) {
    if (prop === internal) throw new Error();
    if (prop === Symbol.iterator) {
      return prop[Symbol.iterator];
    }

    const value = target[internal].get(prop);
    if (isNonPrimitive(value) === true) {
      if (mutable.has(target) === true) {
        return value.ref;
      }

      return value.value;
    }

    return value;
  },

  has(target, prop) {
    return target[internal].has(prop);
  },

  deleteProperty(target, prop) {
    if (mutable.has(target) === true) {
      target[internal].delete(prop);
      return true;
    }

    if (mode === 'strict') {
      throw new TypeError(`Can't delete property ${prop}`);
    }

    return false;
  },

  set(target, prop, value) {
    if (mutable.has(target) === true) {
      // todo: if target.has(prop)? - forbid adding new props?
      target[internal].set(prop, value);
      return true;
    }

    if (mode === 'strict') {
      throw new TypeError(`Can't add/mutate property ${prop}, object is not extensible/mutable`);
    }

    return false;
  },
};

export default function (obj, serializers) {
  const map = new Map(Object.entries(clone(obj, serializers)));

  let proxy;

  function mute(func, ...args) {
    mutable.add(mute);
    try {
      sandbox(func, [proxy, ...args]);
    } catch (ex) {
      /* let's continue anyway :) */
    }

    mutable.delete(mute);
  }

  Object.defineProperty(mute, internal, { value: map });
  mute[Symbol.iterator] = map[Symbol.iterator].bind(map);
  proxy = new Proxy(mute, traps);
  return proxy;
}

export { Serializers };
