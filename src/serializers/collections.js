export default [
  {
    [Symbol.hasInstance](instance) {
      return instance instanceof Set || instance instanceof Map;
    },
    serializer: collection => new collection.constructor(collection),
  },
];
