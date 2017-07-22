export default class Generic { // TODO: implement it, use proxy.js
  constructor(ref) {
    this.ref = ref;
  }

  get value() {
    return this.ref;
  }
}
