import { HaveSameMap } from './v8';
import { getType } from './utils';
import env from './env';

export default function areEqual(lhs, rhs) {
  if (env.isV8 === true && HaveSameMap(lhs, rhs)) { // NOTE: may return false positive, for instance Object.assign() or object with different order
    return true;
  }

  const type = getType(lhs);
  if (type !== getType(rhs)) return false;

  switch (type) {
    case 'Function':
      return Reflect.apply(Function.toString, lhs, []) === Reflect.apply(Function.toString, rhs, []);
    case 'Object':
      return lhs.toString() === rhs.toString();
    case 'ObjectLiteral': {
      const lhsKeys = Object.getOwnPropertyNames(lhs);
      return lhsKeys.length === Object.getOwnPropertyNames(rhs).length && lhsKeys
        .every(key => areEqual(lhs[key], rhs[key]));
    }
    case 'Array':
    case 'TypedArray':
      return lhs.length === rhs.length && lhs.every((item, i) => rhs[i] === item);
    default:
      return lhs === rhs;
  }
}
