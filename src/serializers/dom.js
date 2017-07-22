/* global Window, Document, Node */
export default [
  {
    constructor: typeof Window !== 'undefined' && Window,
    instance(obj) {
      return obj instanceof Node;
    },
    serializer: pass => pass,
  },
  {
    constructor: typeof Document !== 'undefined' && Document,
    serializer: pass => pass,
  },
];
