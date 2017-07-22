export default {
  get isV8() {
    if (this.isStrict === true) return false;
    try {
      eval('%GetV8Version()');
      return true;
    } catch (ex) {
      return false;
    }
  },
  isJest: process.env.NODE_ENV === 'test',
  isStrict: /development|test/.test(process.env.NODE_ENV),
  get isSloppy() {
    return !this.isStrict;
  },
  NODE_ENV: process.env.NODE_ENV,
};
