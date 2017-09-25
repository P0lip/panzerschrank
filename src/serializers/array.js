const TypedArray = Object.getPrototypeOf(new Int8Array(0).constructor);

export default [
  {
    [Symbol.hasInstance](instance) {
      return Array.isArray(instance) || instance instanceof TypedArray;
    },
    serializer: arr => arr.slice(),
  },
];
