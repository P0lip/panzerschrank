const context = Symbol('c');

function proxy(obj, serializer) {
  return new Proxy(obj, {
    get(target, key) {
      if (typeof target[key] === 'function') {
        return (...args) => {
          const newObj = serializer(target);
          Reflect.apply(target[key], newObj, args);
          return proxy(newObj, serializer);
        };
      }

      return target[key];
    },

    set() {
      return false;
    },
  });
}

const nullObj = {
  get value() {
    return null;
  },

  set value(newValue) {
    return false;
  }
};

export default (initial, serializer) => typeof serializer !== 'function' ? nullObj : ({
  [context]: proxy(initial, serializer),
  get value() {
    return this[context];
  },

  set value(newValue) {
    this[context] = newValue;
    return newValue;
  },
});

