import { toStringTag } from '../utils';
import vault from '../vault';

export default [
  {
    [Symbol.hasInstance]: instance => toStringTag(instance) === 'Vault',
    serializer(instance, ...args) {
      const obj = {};
      for (const [key, value] of instance) {
        obj[key] = value;
      }
      return vault(obj, ...args);
    },
  }
]
