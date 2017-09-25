export default [
  {
    [Symbol.hasInstance]: instance => instance instanceof RegExp,
    serializer: regexp => new regexp.constructor(regexp),
  },
];
