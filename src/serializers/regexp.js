export default [
  {
    constructor: RegExp,
    serializer: regexp => new RegExp(regexp),
  },
];
