export default [
  {
    test: [RegExp],
    serializer: regexp => new RegExp(regexp),
  },
];
