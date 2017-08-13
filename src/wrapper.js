const context = Symbol('c');

export default (initial, serializers) => {
  const serializer = serializers.getSerializer(initial);
  return {
    [context]: initial,
    constructor: initial.constructor,
    get value() {
      return serializer(this[context], serializers);
    },

    set value(newValue) {
      this[context] = newValue;
      return this[context];
    },
  };
};
