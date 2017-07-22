export default function proxy(obj, serializers) {
  const adapter = serializers !== void 0 && serializers.getSerializer(obj);
  if (typeof adapter !== 'function') return null;
  return new Proxy(obj, {
    get(target, key) {
      if (typeof target[key] === 'function') { // todo use this for unmatched stuff
        return (...args) => {
          const newObj = adapter(target);
          Reflect.apply(target[key], newObj, args); // todo  // use this in vault :)
          return proxy(newObj, serializers);
        };
      }

      return target[key];
    },

    set() {
      return false;
    },
  });
};
