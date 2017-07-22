function patch(ref, method, func) {
  const descriptor = Object.getOwnPropertyDescriptor(ref, method);
  Object.defineProperty(ref, method, Object.assign({}, descriptor, {
    value(...args) {
      func(...args);
      Reflect.apply(descriptor.value, args);
    },
  }));
}

class ShadowedWeakMap extends WeakMap {
  constructor(ref) {
    super();
    this.ref = ref;
    this.changed = new WeakSet();
    this.deleted = new WeakSet();
    patch(ref, 'set', target => {
      if (this.changed.has(target) !== false) {
        this.set(target, ref.get(target));
      }
    });

    patch(ref, 'delete', target => {
      if (this.changed.has(target) !== false) {
        this.set(target, ref.get(target));
      }
    });
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

    this.changed.add(target);
    return super.set(target, value);
  }

  delete(target) {
    this.changed.add(target);
    if (super.delete(target) === true) {
      this.deleted.add(target);
      return true;
    }

    return false;
  }
}

class ShadowedWeakSet extends WeakSet {
  constructor(ref) {
    super();
    this.ref = ref;
    this.changed = new WeakSet();
    this.deleted = new WeakSet();
    patch(ref, 'add', target => {
      if (this.changed.has(target) !== false) {
        this.add(target);
      }
    });

    patch(ref, 'delete', target => {
      if (this.changed.has(target) !== false) {
        this.add(target);
      }
    });
  }

  has(target) {
    if (this.deleted.has(target) === true) return false;
    return this.ref.has(target) || super.has(target);
  }

  add(target) {
    if (this.deleted.has(target) === true) {
      this.deleted.delete(target);
    }

    this.changed.add(target);
    return super.add(target);
  }

  delete(target) {
    this.changed.add(target);
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
