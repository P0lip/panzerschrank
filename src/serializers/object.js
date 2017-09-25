import { isObjectLiteral } from '../utils'
import vault from '../vault';

export default [
  {
    [Symbol.hasInstance]: instance => isObjectLiteral(instance),
    serializer: (obj, ...args) => vault(obj, ...args),
  },
];
