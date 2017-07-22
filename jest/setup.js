export default function compare(left, right) {
  Object.keys(left).forEach(key => {
    const leftValue = left[key];
    const rightValue = right[key];
    if (typeof leftValue === 'function' || typeof leftValue === 'object') {
      expect(leftValue).not.toBe(rightValue);
      compare(leftValue, rightValue);
    } else {
      expect(leftValue).toEqual(rightValue);
    }
  });
}
