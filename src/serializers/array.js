export default [
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
