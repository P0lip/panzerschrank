# Panzerschrank

The reliable container for your data.

Panzerschrank leverages the power of ES2015+ to bring you an effortless way to help you deal with your objects literals.

## Why?

Frankly speaking - out of sheer boredom.

There is one more reason, though.

Well, I haven't any tool fullfiling my requirements that are as follow:
1. simple to use,
2. lightweight,
3. extensive object literals (described below)

What I needed is basically to have a possibility to unfreeze a frozen object.
Unfreezing means I want to have a possibility to add new or modify existing properties 
Is there any way to prevent mutation to happen?
There are
* Object.seal
* Object.freeze 
* Object.preventExtensions
functions available, however none of them matches my needs.


## Installation:

Install Panzerschrank to your project...

```bash
yarn add panzerschrank
```

...then use it like so:

```js
import vault from 'panzerschrank/sloppy';
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });

```
or
```js
import vault from 'panzerschrank/strict';
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });
```

## Documentation:

Vault uses proxy under the hood, therefore it intercepts property access.
Basically it works like a normal object with quite a few gotchas, though.
The key differences are:
1. In case of non-primitive, you receive a new instance of given object on each get.
2. Adding/modifying property is changed.
3. Vault is iterable.
4. You are not able to list keys - this is intentional, but may be changed in future.

```js
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });
safeObj.numbers; // [0, 1, 2], but...
safeObj.numbers !== safeObj.numbers; // === true
safeObj.numbers.pop(); // === 2
safeObj.numbers.pop(); // === 2
safeObj.numbers.length; // === 3
```

Adding a new property or modifying an existing one is easy...
```js
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });
safeObj(obj => {
  obj.numbers = 'hey, i am string now!';
});
safeObj.numbers; // === 'hey, i am string now!'
```

To avoid the leak of object, the passed function is sandboxed, meaning you can't accept anything but its own scope.
```js
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });
const str = '2234';
safeObj(obj => {
  obj.numbers = str; // throws ReferenceError;
});
```
however, safeObj accepts extra arguments :)
```js
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });
safeObj((obj, str) => {
  obj.numbers = str;
}, '2234');
safeObj.numbers; // === '2234'
```

This is the only way to do it. Setting property in a normal way simply won't work.
```js
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });
safeObj.numbers = 2; // throws exception or does nothing
```

```js
const safeObj = vault({ foo: 'bar', numbers: [0, 1, 2] });
for (const [key, value] of safeObj) {
  console.log(key, value); // prints foo, bar and then numbers and [0, 1, 2];
}
```

## License

[GPLv3](LICENSE)
