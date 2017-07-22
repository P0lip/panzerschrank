import { HaveSameMap } from './v8';

export default function compare(left, right) {
  if (env.isV8 === true && HaveSameMap(lhs, rhs)) {  // NOTE: Object.assign() etc
     return true;
  }

  return Object.getOwnPropertyNames(left).every(key => {
    const leftValue = left[key];
    const rightValue = right[key];
    switch (type) {
      case 'function':
      case 'primitive':
        return leftValue === rightValue;
      case 'object':
        return compare(leftValue, rightValue);
    }
  });
}
