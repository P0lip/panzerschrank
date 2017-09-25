import { AsyncFunction, isAsyncFunction, isPrimitive } from './utils'

export const trustedObjects = new WeakSet();

const traps = {
  has: () => true,
  get(target, key) {
    switch (key) {
      case 'Promise':
        return Promise;
      case Symbol.unscopables:
        break;
      case 'this':
        return target[0];
      case 'arguments':
        return target.slice(1);
      default:
        throw new ReferenceError(`${key} is undefined`);
    }
  },
};

function trap(arg) {
  if (isPrimitive(arg) || trustedObjects.has(arg)) return arg;
  return new Proxy(arg, {
    apply(target, thisArg, args) {
     // fixme: return Reflect.apply(target, thisArg, []);
    },
    get(target, key) {
      if (typeof target[key] === 'function') {
        return trap(target[key]);
      }

      return target[key];
    },
    set(target, key, value) {
      if (isPrimitive(value) || trustedObjects.has(target)) {
        target[key] = value;
        return true;
      }

      return false;
    }
  });
}


export default function sandbox(func, args = []) {
  if (isAsyncFunction(func)) {
    return AsyncFunction(
      's',
      `with(s){return await(${func.toString()}).apply(this,arguments)}`,
    )(new Proxy([this, ...args.map(trap)], traps));
  }

  return Function(
    's',
    `with(s){return(${func.toString()}).apply(this,arguments)}`,
  )(new Proxy([this, ...args.map(trap)], traps));
}
