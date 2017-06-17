import vault from '../index';
import { isObjectLiteral } from '../utils';

export default [
  {
    constructor: Object,
    instance(obj) {
      return isObjectLiteral(obj) === true;
    },
    serializer(obj, serializers) {
      return vault(obj, serializers);
    },
  },
];
