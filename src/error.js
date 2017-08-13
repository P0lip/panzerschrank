export default class extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessError';
  }
}
