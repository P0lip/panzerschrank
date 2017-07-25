import diff from '../src/diff';

describe('Diff', () => {
  test('works', () => { // todo: different cases for each type to make it more clear
    expect(diff([], [])).toBe(true);
    expect(diff(() => {}, () => {})).toBe(true);
    expect(diff(WeakMap.prototype.set, WeakMap.prototype.set)).toBe(true);
    expect(diff(WeakMap.prototype.get, WeakMap.prototype.set)).toBe(false);
    expect(diff({ y: true, x: {} }, { y: true, x: {} })).toBe(true);
   expect(diff(
    { x: true, obj: { x: [2] }, a: { x: true, foo: 2 } },
    { obj: { x: [2] }, a: { x: true, foo: 2 }, x: true },
   )).toBe(true);
   expect(diff(
     { x: true, obj: { x: [2] }, a: { x: true, foo: 2 } },
     { x: false, obj: { x: [2] }, a: { x: true, foo: 2 } },
   )).toBe(false);
   expect(diff(
     { x: true, obj: { x: [2] }, a: { x: true, foo: 2 } },
     { x: false, obj: { x: [2, 4] }, a: { x: true, foo: 2 } },
   )).toBe(false);
  });
});
