import { isNativeFunction } from '../utils';

export default [
  {
    test: [Function],
    serializer(func) {
      if (isNativeFunction(func) === true) return func;
      return sandbox(func, scope);
    }
  },
];
