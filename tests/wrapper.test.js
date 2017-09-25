//import proxy from 'src/wrapper'
//import Serializers from 'src/serializers';
//import array from 'src/serializers/array';
//import date from 'src/serializers/date';
//
//const mySerializers = new Serializers([...array, ...date]);
//
//describe('Wrapper', () => {
//  test('gets value', () => {
//    const arr = proxy([0, 1], mySerializers);
//    expect(arr.value).toEqual([0, 1]);
//    const date = new Date();
//    const obj = proxy(date, mySerializers);
//    expect(obj.value).toEqual(date);
//  });
//
//  test('getter is called', () => {
//    const arr = proxy([0, 1], mySerializers);
//    arr.value.pop();
//    expect(arr.value).toEqual([0, 1]);
//    expect(arr.value.pop()).toBe(1);
//    expect(arr.value.pop()).toBe(1);
//    expect(arr.value.pop() === arr.value.pop()).toBe(true);
//    expect(arr.value).toEqual([0, 1]);
//  });
//
//  test('sets a new value', () => {
//    const arr = proxy([0, 1], mySerializers);
//    arr.value = [0];
//    expect(arr.value).toEqual([0]);
//  });
//
//  test('proper instanceof', () => {
//    const arr = proxy([0, 1], mySerializers);
//    expect(arr.value).toBeInstanceOf(Array);
//  });
//
//  test('proper constructor', () => {
//    const arr = proxy([0, 1], mySerializers);
//    expect(arr.constructor).toBe(Array);
//  });
//});
