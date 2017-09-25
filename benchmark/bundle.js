function proxy(obj, serializers) {
  const adapter = serializers !== void 0 && serializers.getSerializer(obj);
  if (typeof adapter !== 'function') return null;
  return new Proxy(obj, {
    get(target, key) {
      if (typeof target[key] === 'function') {
        return (...args) => {
          const newObj = adapter(target);
          Reflect.apply(target[key], newObj, args); // todo  // use this in vault :)
          return proxy(newObj, serializers);
        };
      }

      return target[key];
    },

    set() {
      return false;
    },
  });
}

function isNativeFunction(func) {
  /* istanbul ignore if */
  const sourceCode = Function.toString.call(func);
  if (sourceCode === Function.toString.call(func.bind(null))) {
    return true;
  }

  try {
    Function(`return (${sourceCode})`); // eslint-disable-line no-new-func
    return false;
  } catch (e) {
    return true;
  }
}

function assert(assertion) {
  if (assertion === false) throw new Error('Assertion failed');
}

function isNativeDescriptor(obj, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (('value' in descriptor) === true) {
    if (typeof descriptor.value === 'function') {
      return isNativeFunction(descriptor.value);
    }

    return true;
  }

  let native = true;
  if (typeof descriptor.get === 'function') {
    native = isNativeFunction(descriptor.get);
  }

  if (native === true && typeof descriptor.set === 'function') {
    native = isNativeFunction(descriptor.set);
  }

  return native;
}

function hasMonkeyPatchedProp(target) {
  try {
    assert(isNativeFunction(target.constructor));
    const proto = Object.getPrototypeOf(target);
    Object.getOwnPropertyNames(proto).forEach(key => {
      if (typeof proto[key] === 'function') {
        assert(isNativeFunction(proto[key]));
      } else {
        assert(isNativeDescriptor(proto, key));
      }
    });

    Object.getOwnPropertyNames(target).forEach(key => {
      if ((key in proto) === true) {
        if (typeof target[key] === 'function') {
          assert(target[key] === proto[key]);
        } else {
          const targetDescriptor = Object.getOwnPropertyDescriptor(target, key);
          const protoDescriptor = Object.getOwnPropertyDescriptor(target, key);
          if (('value' in targetDescriptor) === true) {
            if (typeof targetDescriptor.value === 'function') {
              assert(targetDescriptor.value === protoDescriptor.value);
            }
          }

          if (typeof targetDescriptor.get === 'function') {
            assert(targetDescriptor.get === protoDescriptor.get);
          }

          if (typeof targetDescriptor.set === 'function') {
            assert(targetDescriptor.set === protoDescriptor.set);
          }
        }
      }
    });

    return false;
  } catch (ex) {
    return true;
  }
}

var Serializers = class {
  constructor() {
    this.serializers = new Map();
    this.helpers = new Map();
    this.missed = new WeakSet();
  }

  registerSerializer({ constructor, serializer, instance }) {
    if (this.serializers.has(constructor) === true) {
      throw new Error();
    }

    this.serializers.set(constructor, serializer);
    if (instance !== void 0) this.helpers.set(constructor, instance);
    if (this.missed.has(constructor) === true) this.missed.delete(constructor);
  }

  registerSerializers(serializers) {
    serializers.forEach(this.registerSerializer, this);
  }

  removeSerializer(constructor) {
    return this.serializers.delete(constructor);
  }

  getSerializer(target) {
    if (this.missed.has(target.constructor)) return;
    if ("sloppy" === 'strict' && hasMonkeyPatchedProp(target) === true) {
      throw new TypeError('Target has a monkey patched property');
    }

    const serializer = this.serializers.get(target.constructor);

    if (serializer === void 0) {
      for (const [constructor, instance] of this.helpers.entries()) {
        if (instance(target) === true) {
          const foundSerializer = this.serializers.get(constructor);
          this.serializers.set(target.constructor, foundSerializer);
          return foundSerializer;
        }
      }

      this.missed.add(target.constructor);
    } else {
      return serializer;
    }
  }
};

var array = [
  {
    constructor: Array,
    instance(target) {
      return Object.getPrototypeOf(target.constructor).name === 'TypedArray';
    },
    serializer(arr) {
      const newArr = new arr.constructor(arr.length);
      for (let i = 0; i < newArr.length; i += 1) {
        newArr[i] = arr[i];
      }

      return newArr;
    },
  },
];

const mySerializers = new Serializers();
mySerializers.registerSerializers(array);
const callback = () => {};

let start = performance.now();
for (let i = 0; i < 10000; i += 1) {
  proxy([], mySerializers).map(callback);
}
let end = performance.now() - start;
print('took', `${end}ms`);
print('one req took', `${end / 1000}ms`);

start = performance.now();
for (let i = 0; i < 10000; i += 1) {
  [].map(callback);
}

end = performance.now() - start;
print('took', `${end}ms`);
print('one req took', `${end / 1000}ms`);
;quit()
