import { isPrimitive } from './utils'

export const proxies = new class extends WeakSet {
  trust(obj) {
    return this.add(obj);
  }

  distrust(obj) {
    return this.delete(obj);
  }

  isTrusted(obj) {
    return this.has(obj);
  }
};

const traps = {
  has: () => true,
  get(target, key) {
    if (key === 'this') {
      return target[0];
    }

    if (key === 'arguments') {
      return target.slice(1);
    }

    if (typeof key !== 'symbol') {
      throw new ReferenceError(`${key} is undefined`);
    }
  },
};

function trap(arg) {
  if (isPrimitive(arg) === true || proxies.isTrusted(arg) === true) return arg;
  return new Proxy(arg, {
    apply(target, thisArg, args) {
      return Reflect.apply(
        target,
        thisArg,
        [],
      );
    },
    has: () => true,
    get(target, key) {
      if (typeof target[key] === 'function') {
        return trap(target[key]);
      }

      return target[key];
    },
    set(target, key, value) {
      if (typeof value !== 'object') {
        target[key] = value;
        return value;
      }

      return false;
    }
  });
}

export default function sandbox(func, args = []) {
  return Function(
    's',
    `with(s){return(${func.toString()}).apply(this,arguments)}`,
  )(new Proxy([this, ...args.map(trap)], traps));
}
