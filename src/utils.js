import env from './env';

export function assert(assertion) {
  if (assertion === false) throw new Error('Assertion failed');
}

export function isNative(func) {
  /* istanbul ignore if */
  const sourceCode = Reflect.apply(Function.toString, func, []);
  if (sourceCode === Reflect.apply(Function.toString, func.bind(null), [])) {
    return true;
  }

  try {
    Function(`return (${sourceCode})`); // eslint-disable-line no-new-func
    return false;
  } catch (e) {
    return true;
  }
}

export function isNativeDescriptor(obj, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (('value' in descriptor) === true) {
    if (typeof descriptor.value === 'function') {
      return isNative(descriptor.value);
    }

    return true;
  }

  if (typeof descriptor.get === 'function') {
    if (isNative(descriptor.get) === false) return false;
  }

  if (typeof descriptor.set === 'function') {
    return isNative(descriptor.set);
  }

  return true;
}

export function hasMonkeyPatchedProp(target) {
  try {
    assert(isNative(target.constructor));
    const proto = Object.getPrototypeOf(target);
    Object.getOwnPropertyNames(proto).forEach(key => {
      if (typeof proto[key] === 'function') {
        assert(isNative(proto[key]));
      } else {
        assert(isNativeDescriptor(proto, key));
      }
    });

    Object.getOwnPropertyNames(target).forEach(key => {
      if ((key in proto) === true) {
        if (typeof target[key] === 'function') {
          assert(target[key] === proto[key]);
        } else {
          const targetDescriptor = Object.getOwnPropertyDescriptor(target, key);
          const protoDescriptor = Object.getOwnPropertyDescriptor(target, key);
          if (('value' in targetDescriptor) === true) {
            if (typeof targetDescriptor.value === 'function') {
              assert(targetDescriptor.value === protoDescriptor.value);
            }
          }

          if (typeof targetDescriptor.get === 'function') {
            assert(targetDescriptor.get === protoDescriptor.get);
          }

          if (typeof targetDescriptor.set === 'function') {
            assert(targetDescriptor.set === protoDescriptor.set);
          }
        }
      }
    });

    return false;
  } catch (ex) {
    return true;
  }
}

export function toArray(iterable) {
  if (env.mode === 'strict' && isNative(iterable[Symbol.iterator]) === false) {
    throw new TypeError(`${iterable.name} has a monkey-patched iterator!`);
  }

  return Array.from(iterable);
}

export function isObject(obj) {
  return obj !== void 0 && obj !== null && typeof obj === 'object';
}

export function isPrimitive(target) {
  return typeof target !== 'function' && isObject(target) === false;
}

const { toString } = {};
if (env.mode === 'strict') {
  assert(isNative(toString));
}

export function isObjectLiteral(obj) {
  if (isPrimitive(obj) === true) return false;
  if (obj[Symbol.toStringTag] !== void 0) {
    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }

  return Reflect.apply(toString, obj, []) === '[object Object]';
}

export function getType(sth) { // TODO: is any runtime method exposed for this?
  if (sth === null) return 'Null';
  const type = typeof sth;
  switch (type) {
    case 'function':
      if (env.mode === 'strict' && isNative(sth) === true) return 'NativeFunction';
      return 'Function';
    case 'object':
      if (Array.isArray(sth) === true) {
        return Object.getPrototypeOf(sth.constructor).name || 'Array';
      }

      if (isObjectLiteral(sth) === true) return 'ObjectLiteral';
      return 'Object';
      break;
    default:
      return type[0].toUpperCase() + type.slice(1);
  }
}
