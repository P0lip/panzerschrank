function generic(sth) {
  try {
    return JSON.parse(JSON.stringify(sth));
  } catch(ex) {
    return null;
  }
}

export default class extends Set {
  add(serializer) {
    if (Array.isArray(serializer)) {
      serializer.forEach(super.add, this);
    } else {
      super.add(serializer);
    }
  }

  get(instance) {
    // STRICT: if more then 2 found throw
    const found = Array.from(this).find(serializer => instance instanceof serializer);
    if (found !== void 0) return found.serializer;
    return generic;
  }
}
