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
    case 'boolean':
    case 'number':
    case 'string':
    case 'symbol':
    case 'native-function':
      return lhs === rhs;
    case 'function':
      return lhs.toString() === rhs.toString();
    case 'object':
    case 'object-literal': {
      const lhsKeys = Object.getOwnPropertyNames(lhs);
      return lhsKeys.length === Object.getOwnPropertyNames(rhs).length && lhsKeys
        .every(key => areEqual(lhs[key], rhs[key]));
    }
    case 'array':
    case 'typed-array':
      return lhs.length === rhs.length && lhs.every((item, i) => rhs[i] === item);
    default:
      return false;
  }
}
