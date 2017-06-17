export default (func, context, args) => { // eslint-disable-line consistent-return
  try {
    return func.apply(context, args);
  } catch (ex) { // eslint-disable-line no-empty
  }
};
