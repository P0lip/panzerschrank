import vault from '../../src/index';
import Serializers from '../../src/serializers';
import date from '../../src/serializers/date';
import compare from '../compare';

const serializers = new Serializers();
serializers.registerSerializers(date);

test('clones properly', () => {
  [
    { c: true, arr: new Date() },
  ].forEach(obj => {
    compare(vault(obj, serializers), obj);
  });
});

