import vault from '../../src/index';
import Serializers from '../../src/serializers';
import regexp from '../../src/serializers/regexp';
import compare from '../compare';

const serializers = new Serializers();
serializers.registerSerializers(regexp);

test('clones properly', () => {
  [
    { c: true, reg: /22/ },
  ].forEach(obj => {
    compare(vault(obj, serializers), obj);
  });
});

