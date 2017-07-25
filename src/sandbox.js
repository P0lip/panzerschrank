import { isNonPrimitive } from './utils';

const traps = {
  has: () => true,
  get(target, prop) {
    if (prop === 'this') {
      return target[0];
    }

    if (prop === 'arguments') {
      return target.slice(1);
    }
  },
};

function materializeArgument(arg) {
  if (typeof arg === 'function') {
    return () => {};
  }

  return JSON.parse(JSON.stringify(arg));
}

export default function sandbox(func, args = []) {
  const sandboxedFunc = Function(
    's',
    `with(s){return(${func.toString()}).apply(this,arguments)}`,
  );
  return sandboxedFunc(new Proxy([this, ...args.map(materializeArgument)], traps));
}
