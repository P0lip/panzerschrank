export function assert(assertion) {
  if (assertion === false) throw new Error();
}

export function toString(obj) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isNativeFunction(obj.toString));
  }
  try {
    return obj.toString();
  } catch (ex) {
    return '';
  }
}

export function toStringTag(obj) {
  if (process.env.NODE_ENV !== 'production') {
    assert(isNativeFunction(Object.prototype.toString));
  }

  const tag = obj[Symbol.toStringTag];
  if (typeof tag === 'string') {
    return tag;
  }

  const name = Reflect.apply(Object.prototype.toString, obj, []);
  return name.slice(8, name.length - 1); // reliable enough?
}

export function getSourceCode(func) {
  return Reflect.apply(Function.toString, func, []);
}

export function isNativeFunction(func) {
  /* istanbul ignore if */
  const sourceCode = getSourceCode(func);
  if (sourceCode === getSourceCode(func.bind(null))) {
    return true;
  }

  try {
    Function(`return(${sourceCode})`); // eslint-disable-line no-new-func
    return false;
  } catch (e) {
    return true;
  }
}

export const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

export function isAsyncFunction(func) {
  return func instanceof AsyncFunction;
}

export function isNativeDescriptor(obj, prop) {
  const descriptor = Reflect.getOwnPropertyDescriptor(obj, prop);
  return descriptor !== void 0 && Object.values(descriptor)
    .every(item => typeof item !== 'function' || isNativeFunction(item));
}

export function hasMonkeyPatchedProp(target, props) {
  return !props.every(prop => (
    !Object.prototype.hasOwnProperty.call(target, prop) || isNativeDescriptor(target, prop)
  ));
}

export function isVault(obj) {
  return isObject(obj) && toStringTag(obj) === 'Vault';
}

export function isObject(obj) {
  return obj !== void 0 && obj !== null && typeof obj === 'object';
}

export function isPrimitive(target) {
  return typeof target !== 'function' && !isObject(target);
}

export function isObjectLiteral(obj) {
  if (!isObject(obj)) return false;
  if (obj[Symbol.toStringTag] !== void 0) {
    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }

  return toStringTag(obj) === 'Object';
}

export function getType(sth) {
  if (sth === null) return 'null';
  const type = typeof sth;
  switch (type) {
    case 'function':
      if (typeof sth[Symbol.toStringTag] === 'string') return sth[Symbol.toStringTag];
      if (isNativeFunction(sth)) return 'NativeFunction';
      return 'Function';
    case 'object':
      if (Array.isArray(sth)) return 'Array';
      if (isObjectLiteral(sth)) return 'ObjectLiteral';
      if (Object.getPrototypeOf(sth.constructor).name === 'TypedArray') return 'TypedArray';
      return toStringTag(sth);
    default:
      return type;
  }
}
