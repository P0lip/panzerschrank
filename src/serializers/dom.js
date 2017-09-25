/* global Window, Document, HTMLElement, CharacterData */
export default [
  {
    [Symbol.hasInstance](instance) {
      if (typeof window === 'undefined') return false;
      return [Window, Document, HTMLElement, CharacterData]
        .some(constructor => instance instanceof constructor)
    },
    serializer: pass => pass,
  },
];
