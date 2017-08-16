const context = Symbol('c');

export default (initial, serializers) => {
  const serializer = serializers.getSerializer(initial);
  return {
    [context]: initial,
    constructor: initial.constructor, // todo: make me great again (use well-known Symbols, add tests for instanceof, Array.isArray etc)
    get value() {
      return serializer(this[context], serializers);
    },

    set value(newValue) {
      this[context] = newValue;
      return this[context];
    },
  };
};
