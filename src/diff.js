import { HaveSameMap } from './v8';
import { getType, getSourceCode, toString } from './utils';
import env from './env';

function toObject(vault) {
  const obj = {};
  for (const [key, value] of vault) {
    obj[key] = value;
  }
  return obj;
}

export default function areEqual(lhs, rhs) {
  if (env.isV8 === true && HaveSameMap(lhs, rhs)) { // NOTE: may return false positive, for instance Object.assign() or object with different order
    return true;
  }

  const lhsType = getType(lhs);
  const rhsType = getType(rhs);
  if (lhsType !== rhsType) {
    if (lhsType === 'Vault') return areEqual(toObject(lhs), rhs);
    if (rhsType === 'Vault') return areEqual(lhs, toObject(rhs));
    return false;
  }

  switch (lhsType) {
    case 'Function':
      return getSourceCode(lhs) === getSourceCode(rhs);
    case 'Object':
    case 'Date':
    case 'RegExp':
      return toString(lhs) === toString(rhs);
    case 'ObjectLiteral': {
      const lhsKeys = Reflect.ownKeys(lhs);
      return lhsKeys.length === Reflect.ownKeys(rhs).length && lhsKeys
        .every(key => areEqual(lhs[key], rhs[key]));
    }
    case 'Array':
    case 'TypedArray':
      return lhs.length === rhs.length && lhs.every((item, i) => rhs[i] === item);
    default:
      return lhs === rhs;
  }
}
