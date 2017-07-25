import diff from 'src/diff';
import clone from 'src/clone';

export default function (items) {
  expect(
    items.every(item => diff(clone(item), item))
  ).toBe(true);
}
