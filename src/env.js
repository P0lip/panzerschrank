export default {
  get isV8() {
    if (this.mode === 'sloppy') return false;
    try {
      eval('%GetV8Version()');
      return true;
    } catch (ex) {
      return false;
    }
  },
  mode: /development|test/.test(process.env.NODE_ENV) ? 'strict' : 'sloppy',
  isJest: process.env.NODE_ENV === 'test',
  NODE_ENV: process.env.NODE_ENV,
};
