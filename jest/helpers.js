import diff from 'src/diff';
import clone from 'src/clone';

export function compare(items) {
  expect(
    items.every(item => diff(clone(item), item))
  ).toBe(true);
}
