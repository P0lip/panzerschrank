const traps = {
  has: () => true,
  get(target, prop) {
    if (prop === 'arguments') {
      return target;
    }
  },
};

export default (func, args = []) => {
  const sandboxedFunc = Function(
    's',
    `with(s){return(${func.toString()}).apply(null, arguments)}`,
  );
  return sandboxedFunc(new Proxy(args, traps));
};
