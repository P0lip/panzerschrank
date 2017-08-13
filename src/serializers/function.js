import { isNative } from '../utils';

export default [
  {
    test: [Function],
    serializer(func) {
      if (isNative(func) === true) return func;
      const newFunc = new Function(func); // proxy or something, ya know
      const desc = Object.getOwnPropertyDescriptor(func, 'name');
      Object.defineProperty(newFunc, 'name', desc);
    }
  },
];
