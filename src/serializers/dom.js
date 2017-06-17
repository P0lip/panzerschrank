/* global Window, Document, Node */
export default [
  {
    constructor: Window,
    instance(obj) {
      return obj instanceof Node;
    },
    serializer(pass) { return pass; },
  },
  {
    constructor: Document,
    serializer(pass) { return pass; },
  },
];
