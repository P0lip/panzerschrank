import clone, { internal } from './clone';
import Serializers from './serializers';
import sandbox, { proxies } from './sandbox';
import env from './env';
import AccessError from './error';

const traps = {
  get(target, key) {
    if (key === internal) {
      throw new AccessError({
        reason: 'Internal',
        key,
      });
    }

    switch (key) {
      case Symbol.hasInstance:
        return false; // TODO: implement me
      case Symbol.iterator:
        return target[Symbol.iterator];
      case Symbol.toStringTag:
        return 'Vault';
      default:
        return Reflect.get(target[internal].store, key);
    }
  },

  has(target, key) {
    return Reflect.has(target[internal].store, key);
  },

  deleteProperty(target, key) {
    if (target[internal].mutable === true) {
      return Reflect.deleteProperty(target[internal].store, key);
    }

    if (env.mode === 'strict') {
      throw new AccessError({
        reason: 'Deletion',
        key,
      });
    }

    return false;
  },

  set(target, key, value) {
    if (target[internal].mutable === true) {
      return Reflect.set(target[internal].store, key, value, this[internal].context);
    }

    if (env.mode === 'strict') {
      throw new AccessError({
        reason: (key in target) ? 'Modifying' : 'Addition',
        key,
      });
    }

    return false;
  },

  defineProperty(target, key, descriptor) {
    if (target[internal].mutable === true) {
      return Reflect.defineProperty(target, key, Object.assign({}, descriptor, {
        enumerable: true,
        writable: true,
        configurable: true,
      }));
    }

    if (env.mode === 'strict') {
      throw new AccessError({
        reason: (key in target) ? 'Modifying' : 'Addition',
        key,
      });
    }

    return false;
  },

  ownKeys(target) {
    return [
      'prototype',
      ...Object.keys(target),
      Symbol.iterator,
    ];
  },

  getOwnPropertyDescriptor(target, key) {
    if (key === internal) {
      if (env.isJest === true) {
        return {
          writable: false,
          configurable: true,
          enumerable: false,
          value: internal,
        };
      }

      throw new AccessError('Get', key);
    }

    return Object.getOwnPropertyDescriptor(target, key);
  }
};

export function getContext() {
  return {
    mutable: false,
  };
}

export default function (obj, serializers, context = getContext()) {
  const store = clone(obj, serializers, context);
  let proxy;
  function handler(func, ...args) {
    try {
      proxies.trust(proxy);
      handler[internal].mutable = true;
      sandbox.call(null, func, [proxy, ...args]);
      handler[internal].mutable = false;
      proxies.distrust(proxy);
    } catch (ex) {
      handler[internal].mutable = false;
      proxies.distrust(proxy);
      throw ex;
    }
  }

  Object.setPrototypeOf(handler, null);
  Object.defineProperties(handler, {
    [internal]: {
      configurable: true,
      value: {
        store,
        context,
        get mutable() {
          return context.mutable;
        },
        set mutable(value) {
          context.mutable = value;
          return value;
        },
        serializers,
      },
    },
    [Symbol.iterator]: {
      configurable: true,
      enumerable: true,
      *value() {
        context.mutable = false;
        yield* Object.entries(
          Object.defineProperties({}, Object.getOwnPropertyDescriptors(store)),
        );
        context.mutable = true;
      }
    },
  });

  proxy = new Proxy(handler, traps);
  return proxy;
}

export { Serializers };
