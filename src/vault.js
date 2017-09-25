import clone, { getDescriptor, internal } from './clone';
import sandbox, { trustedObjects } from './sandbox';
import { ReadError, WriteError } from './error';
import { isVault } from './utils';
import Serializers from './serializers';
import objLiteral from './serializers/vault';

const traps = {
  get(target, key) {
    if (key === internal) {
      throw new ReadError(key);
    }

    switch (key) {
      case Symbol.hasInstance:
      case Symbol.iterator:
      case Symbol.toStringTag:
        return target[key];
      default:
        return Reflect.get(target[internal].store, key, target[internal].context);
    }
  },

  has(target, key) {
    return Reflect.has(target[internal].store, key);
  },

  deleteProperty(target, key) {
    if (target[internal].mutable) {
      return Reflect.deleteProperty(target[internal].store, key);
    }

    throw new WriteError(key);
  },

  set(target, key, value) {
    if (target[internal].mutable) {
      if (key in target[internal].store) {
        return Reflect.set(target[internal].store, key, value, target[internal].context);
      }

      if (Reflect.defineProperty(
          target[internal].store,
          key,
          getDescriptor(value, target[internal].serializers, target[internal].context),
        )
      ) {
        return value;
      }

      return false;
    }

    throw new WriteError();
  },

  defineProperty(target, key, descriptor) {
    if (target[internal].mutable) {
      return Reflect.defineProperty(target, key, Object.assign({}, descriptor, {
        enumerable: true,
        writable: true,
        configurable: true,
      }));
    }

    throw new WriteError(key);
  },

  ownKeys(target) {
    return [
      'prototype',
      ...Object.keys(target),
      Symbol.iterator,
      Symbol.hasInstance,
      Symbol.toStringTag,
    ];
  },

  getOwnPropertyDescriptor(target, key) {
    if (key === internal) {
      throw new ReadError(key);
    }

    return Reflect.getOwnPropertyDescriptor(target, key);
  }
};

export function getContext() {
  return {
    mutable: false,
  };
}

const defaultSerializers = new Serializers(objLiteral);

export default function (obj, serializers = defaultSerializers, context = getContext()) {
  const store = clone(obj, serializers, context);
  const proxy = new Proxy(handler, traps);
  function handler(func, ...args) {
    try {
      trustedObjects.add(proxy);
      handler[internal].mutable = true;
      sandbox.call(null, func, [proxy, ...args]);
      handler[internal].mutable = false;
      trustedObjects.delete(proxy);
    } catch (ex) {
      handler[internal].mutable = false;
      trustedObjects.delete(proxy);
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
    [Symbol.hasInstance]: {
      configurable: true,
      enumerable: true,
      value(instance) {
        return isVault(instance);
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
    [Symbol.toStringTag]: {
      configurable: true,
      enumerable: true,
      value: 'Vault',
    },
  });

  return proxy;
}
