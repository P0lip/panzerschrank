import env from './env';
import diff from './diff';

export function assert(assertion) {
  if (assertion === false) throw new Error('Assertion failed');
}

export function toString(obj) {
  if (env.mode === 'strict') {
    assert(isNative(obj.toString));
  }
  try {
    return obj.toString();
  } catch (ex) {
    return '';
  }
}

export function toStringTag(obj) {
  if (env.mode === 'strict') {
    assert(isNative(Object.prototype.toString));
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

export function isNative(func) {
  /* istanbul ignore if */
  const sourceCode = getSourceCode(func);
  if (sourceCode === getSourceCode(func.bind(null))) {
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
  const descriptor = Reflect.getOwnPropertyDescriptor(obj, prop);
  return descriptor !== void 0 && Object.values(descriptor)
    .every(item => typeof item !== 'function' || isNative(item));
}

export function hasMonkeyPatchedProp(prototype) {
  return !Reflect.ownKeys(prototype)
      .every(prop => isNativeDescriptor(prototype, prop));
}

export function isObject(obj) {
  return obj !== void 0 && obj !== null && typeof obj === 'object';
}

export function isPrimitive(target) {
  return typeof target !== 'function' && isObject(target) === false;
}

export function isObjectLiteral(obj) {
  if (isPrimitive(obj) === true) return false;
  if (obj[Symbol.toStringTag] !== void 0) {
    const proto = Object.getPrototypeOf(obj);
    return proto === null || proto === Object.prototype;
  }

  return toStringTag(obj) === 'Object';
}

export function getType(sth) { // TODO: use runtime method (provided that there is any exposed)
  if (sth === null) return 'null';
  const type = typeof sth;
  switch (type) {
    case 'function':
      if (typeof sth[Symbol.toStringTag] === 'string') return sth[Symbol.toStringTag];
      if (env.mode === 'strict' && isNative(sth) === true) return 'NativeFunction';
      return 'Function';
    case 'object':
      if (Array.isArray(sth) === true) return 'Array';
      if (isObjectLiteral(sth) === true) return 'ObjectLiteral';
      if (Object.getPrototypeOf(sth.constructor).name === 'TypedArray') return 'TypedArray';
      return toStringTag(sth);
    default:
      return type;
  }
}
