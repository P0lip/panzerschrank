export default [
  {
    test: [
      Array,
      Object.getPrototypeOf(new Int8Array(0).constructor),
    ],
    serializer: arr => arr.slice(),
  },
];
