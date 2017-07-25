import proxy from '../src/proxy'
import Serializers from '../src/serializers';
import array from '../src/serializers/array';

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
