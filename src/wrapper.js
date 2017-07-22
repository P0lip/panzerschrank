import proxy from './proxy';

export default class Wrapper {
  constructor(initial, adapter, serializers) {
    this.ref = proxy(initial, serializers); // pass sth like mutable and use it, then remove set value(){}
    this.adapter = adapter;
    this.serializers = serializers;
  }

  get value() {
    // TODO:
    // don't copy/clone objects over and over again...
    // We could observe changes for some simpler (non-exotic) objects...
    // Ultimately, we would clone/copy an object only when its shape changes
    // For arrays we could monkey-patch a 'length' prop and take care of method that change order of items.
    return this.ref;
  }

  set value(newValue) {
    this.ref = this.adapter(newValue, this.serializers);
    return this.ref;
  }
}
