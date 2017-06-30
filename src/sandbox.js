import { isObject } from './utils';

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

function materializeArguments(args) {
  return args.map(arg => isObject(arg) === true ? JSON.parse(JSON.stringify(arg)) : arg);
}

export default function(func, args = []) {
  const sandboxedFunc = Function(
    's',
    `with(s){return(${func.toString()}).apply(this,arguments)}`,
  );
  return sandboxedFunc(new Proxy([this, ...materializeArguments(args)], traps));
};
