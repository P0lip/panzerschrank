export default [
  {
    constructor: Promise,
    serializer: promise => promise.then(),
  },
];
