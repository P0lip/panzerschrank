/* global Window, Document, Node */
export default [
  {
    test: typeof window === 'undefined' ? [] : [
      Window,
      Document,
      HTMLElement,
      CharacterData
    ],
    serializer: pass => pass,
  },
];
