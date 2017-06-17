import mayFail from '../src/mayFail';

test('returns proper value when no exception is thrown', () => {
  expect(mayFail(Array.from, [], [[2, 3]])).toEqual([2, 3]);
});

test('doesnt accept comma-separated args', () => {
  expect(mayFail(Array.from, [], 2, 3)).toEqual(undefined);
});

test('returns value even when no args are present', () => {
  expect(mayFail(Array.prototype.slice, [])).toEqual([]);
});

test('returns undefined on throw', () => {
  expect(mayFail(JSON.parse, JSON, ['[}{}l;cxz'])).toBe(undefined);
});
