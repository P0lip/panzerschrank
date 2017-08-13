import diff from 'src/diff';
import clone, { internal } from 'src/clone';

export function compare(items, serializers) {
  expect(
    items.filter(item => !diff(Object.assign({}, clone(item, serializers)), item))
  ).toEqual([]);
}
