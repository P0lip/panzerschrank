export default [
  {
    [Symbol.hasInstance]: instance => instance instanceof Date,
    serializer: date => new date.constructor(date),
  },
];
