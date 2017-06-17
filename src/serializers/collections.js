const defaults = {
  enumerable: true,
};

function patch(target, ref) {
  if ('set' in target) {
    Object.defineProperty(target, 'set', Object.assign({}, defaults, {
      value() {

      }
    }));
  }
}

class ShadowedWeakMap extends WeakMap {
  constructor(ref) {
    super();
    this.ref = patch(ref); // we should monkey-patch set and delete here...
    this.deleted = new WeakSet();
  }

  get(target) {
    if (this.deleted.has(target) === true) return;
    if (super.has(target) === true) return super.get(target);
    return this.ref.get(target);
  }

  has(target) {
    if (this.deleted.has(target) === true) return false;
    return this.ref.has(target) || super.has(target);
  }

  set(target, value) {
    if (this.deleted.has(target) === true) {
      this.deleted.delete(target);
    }

    return super.set(target, value);
  }

  delete(target) {
    if (super.delete(target) === true) {
      this.deleted.add(target);
      return true;
    }

    return false;
  }
}

export default [
  {
    constructor: Set,
    serializer: set => new Set(set),
  },
  {
    constructor: Map,
    serializer: map => new Map(map),
  },
  {
    constructor: WeakMap,
    serializer: weakMap => new ShadowedWeakMap(weakMap),
  },
  {
    constructor: WeakSet,
    serializer: weakSet => new ShadowedWeakSet(weakSet),
  },
];
