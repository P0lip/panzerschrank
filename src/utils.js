export function isNative(func) {
  /* istanbul ignore if */
  const sourceCode = Function.toString.call(func);
  if (sourceCode === Function.toString.call(func.bind(null))) {
    return true;
  }

  try {
    Function(`return (${sourceCode})`); // eslint-disable-line no-new-func
    return false;
  } catch (e) {
    return true;
  }
}

export function assert(assertion) {
  if (assertion === false) throw new Error('Assertion failed');
}

export function isNativeDescriptor(obj, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (('value' in descriptor) === true) {
    if (typeof descriptor.value === 'function') {
      return isNative(descriptor.value);
    }

    return true;
  }

  let native = true;
  if (typeof descriptor.get === 'function') {
    native = isNative(descriptor.get);
  }

  if (native === true && typeof descriptor.set === 'function') {
    native = isNative(descriptor.set);
  }

  return native;
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
  if (mode === 'strict' && isNative(iterable[Symbol.iterator]) === false) {
    throw new TypeError(`${iterable.name} has a monkey-patched iterator!`);
  }

  return Array.from(iterable);
}

export function isObject(obj) {
  return obj !== void 0 && obj !== null && typeof obj === 'object';
}

export function isObjectLiteral(obj) {
  if (obj === null || obj === void 0) return false;
  if (obj[Symbol.toStringTag] !== void 0) {
    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }

  return {}.toString.call(obj) === '[object Object]';
}

export function isNonPrimitive(target) {
  return isObject(target) === true || typeof target === 'function';
}
