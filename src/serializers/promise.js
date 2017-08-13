export default [
  {
    test: [Promise],
    serializer: promise => promise.then(),
  },
];
