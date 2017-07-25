import clone, { internal } from './clone';
import Serializers from './serializers';
import sandbox from './sandbox';
import env from './env';

const traps = {
  get(target, prop) {
    if (prop === internal) throw new Error();
    if (prop === Symbol.iterator) {
      return prop[Symbol.iterator];
    }

    return target[internal].get(prop);
  },

  has(target, prop) {
    return target[internal].has(prop);
  },

  deleteProperty(target, prop) {
    if (target[internal].mutable === true) {
      target[internal].delete(prop);
      return true;
    }

    if (env.isStrict === true) {
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

    if (env.isStrict === true) {
      throw new TypeError(`Can't add/mutate property ${prop}, object is not extensible/mutable`);
    }

    return false;
  },

  defineProperty(target, prop, descriptor) {
    // todo: how to deal with this?
    // like it was setter? dunno, as what if descriptor is non-enumerable, non-writable etc?
  },

  apply(target, thisArg, argumentsList) {
    try {
      target[internal].mutable = true;
      sandbox(argumentsList[0], [target, argumentsList.slice(1)]); // todo shall we pass serializers here?
    } catch (ex) {}
    target[internal].mutable = false;
  },

  ownKeys() {
    return [];
  },

  getOwnPropertyDescriptor(target, prop) {
    if (prop === Symbol.iterator) {
      return {
        writable: false,
        configurable: false,
        enumerable: false,
        value: target[Symbol.iterator],
      };
    }

    if (env.isJest === true && prop === 'internal') {
      return {
        writable: false,
        configurable: false,
        enumerable: false,
        value: internal,
      };
    }
  }
};

export default function (obj, serializers) {
  const map = new Map(Object.entries(clone(obj, serializers)));

  const proxy = () => {};
  Object.defineProperties(proxy, {
    [internal]: {
      value: {
        store: map,
        get(...args) {
          return map.get(...args);
        },
        has(...args) {
          return map.has(...args);
        },
        set(...args) {
          return map.set(...args);
        },
        mutable: false,
      },
    },
    [Symbol.iterator]: {
      value: map[Symbol.iterator].bind(map),
    },
  });
  return new Proxy(proxy, traps);
}

export { Serializers };
