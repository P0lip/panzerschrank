import { isObject } from './utils';
import Serializers from './serializers';
import knownSerializers from './serializers/index';

class Wrapper {
  constructor(initial, adapter, serializers) {
    this.ref = adapter(initial, serializers);
    this.adapter = adapter;
    this.serializers = serializers;
  }

  get value() {
    // TODO:
    // don't copy/clone objects over and over again...
    // We could observe changes for some simpler objects...
    // Ultimately, we would clone/copy an object only when its shape changes
    // For arrays we could monkey-patch a 'length' prop and take care of any sorting/reverse methods.
    return this.adapter(this.ref, this.serializers);
  }

  set value(newValue) {
    this.ref = this.adapter(newValue, this.serializers);
    return this.ref;
  }
}

const defaultSerializers = new Serializers();
defaultSerializers.registerSerializers(knownSerializers);

export default (prev, serializers = defaultSerializers) => {
  const keys = Object.keys(prev);
  if (keys.length === 0) return {};
  const next = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (isObject(prev[key]) === true) {
      const adapter = serializers !== void 0 && serializers.getSerializer(prev[key]);
      if (typeof adapter !== 'function') {
        next[key] = null;
      } else {
        next[key] = new Wrapper(prev[key], adapter, serializers);
      }
    } else {
      next[key] = prev[key];
    }
  }

  return next;
};
