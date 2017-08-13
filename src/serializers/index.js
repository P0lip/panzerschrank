import array from './array';
import date from './date';
import regexp from './regexp';
import dom from './dom';
import promise from './promise';
import collections from './collections';

const serializers = [
  ...array,
  ...date,
  ...regexp,
  ...promise,
  ...collections,
];

if (process.env.TARGET === 'browser') {
  serializers.push(...dom);
}


export default serializers;
