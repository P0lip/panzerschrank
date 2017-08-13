import { compare } from 'jest/helpers';

describe('Object serializer', () => {
  test('clones properly', () => {
    compare([
      {},
      { foo: 'bar' },
      { x: true, obj: { x: true }, a: { x: true, foo: 2 } },
      { x: true, obj: { x: false, a: { b: 'ddd' } }, a: { x: true, foo: 2 } },
    ]);
  });
});
