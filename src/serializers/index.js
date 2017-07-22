import array from './array';
import object from './object';
import date from './date';
import regexp from './regexp';
import dom from './dom';
import promise from './promise';
import collections from './collections';

export default [
  ...array,
  ...object,
  ...date,
  ...regexp,
  ...dom,
  ...promise,
  ...collections,
];
