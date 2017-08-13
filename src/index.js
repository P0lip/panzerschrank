import clone, { internal } from './clone';
import Serializers from './serializers';
import sandbox, { proxies } from './sandbox';
import env from './env';
import AccessError from './error';

const traps = {
  get(target, key) {
    if (key === internal) throw new AccessError('Internal');
    if (key === Symbol.iterator) {
      return target[Symbol.iterator];
    }

    return Reflect.get(target[internal].store, key);
  },

  has(target, key) {
    return Reflect.has(target[internal].store, key);
  },

  deleteProperty(target, key) {
    if (target[internal].mutable === true) {
      return Reflect.deleteProperty(target[internal].store, key);
    }

    if (env.mode === 'strict') {
      throw new TypeError(`Can't delete property ${key}`);
    }

    return false;
  },

  set(target, key, value) {
    if (target[internal].mutable === true) {
      return Reflect.set(target[internal].store, key, value);
    }

    if (env.mode === 'strict') {
      throw new TypeError(`Can't add/mutate property ${key}, object is not extensible/mutable`);
    }

    return false;
  },

  defineProperty(target, prop, descriptor) {
    // todo: how to deal with this?
    // like it was setter? dunno, as what if descriptor is non-enumerable, non-writable etc?
  },

  ownKeys(target) {
    return ['prototype'];
  },

  getOwnPropertyDescriptor(target, prop) {
    if (prop === Symbol.iterator) {
      return {
        writable: false,
        configurable: true,
        enumerable: true,
        value: target[Symbol.iterator],
      };
    }

    if (env.isJest === true && prop === internal) {
      return {
        writable: false,
        configurable: true,
        enumerable: false,
        value: internal,
      };
    }

    return {
      writable: false,
      configurable: false,
      enumerable: false,
      value: void 0,
    };
  }
};

export default function (obj, serializers) {
  let proxy;
  function handler(func, ...args) {
    try {
      proxies.trust(proxy);
      handler[internal].mutable = true;
      sandbox.call(null, func, [proxy, ...args]);
    } catch (ex) {}
    handler[internal].mutable = false;
    proxies.distrust(proxy);
  }

  Object.setPrototypeOf(handler, null);

  Object.defineProperties(handler, {
    [internal]: {
      configurable: true,
      value: {
        store: clone(obj, serializers),
        mutable: false,
        serializers,
      },
    },
    [Symbol.iterator]: {
      configurable: true,
      enumerable: true,
      value() {
        return [];
      },
    },
  });

  proxy = new Proxy(handler, traps);
  return proxy;
}

export { Serializers };
