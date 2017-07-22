import vault from '../../src/index';
import Serializers from '../../src/serializers';
import object from '../../src/serializers/object';
import compare from '../compare';

const serializers = new Serializers();
serializers.registerSerializers(object);

test('clones objects properly', () => {
  [
    {},
    { foo: 'bar' },
    { x: true, obj: { x: true }, a: { x: true, foo: 2 } },
    { x: true, obj: { x: false, a: { b: 'ddd' } }, a: { x: true, foo: 2 } },
  ].forEach(obj => compare(vault(obj, serializers), obj));
});
