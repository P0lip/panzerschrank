export default class extends Error {
  constructor({ reason, key }) {
    super(reason);
    this.name = 'AccessError';
    this.key = key;
  }
}

export class StrictError extends Error {

}
