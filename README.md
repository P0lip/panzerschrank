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

Coming soon...


## License

[GPLv3](LICENSE)
