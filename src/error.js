export class ReadError extends Error {
  constructor(key) {
    super(key);
    this.name = 'ReadError';
  }
}

export class WriteError extends Error {
  constructor(key) {
    super(key);
    this.name = 'WriteError';
  }
}
