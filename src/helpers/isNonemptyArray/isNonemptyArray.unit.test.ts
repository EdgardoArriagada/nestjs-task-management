import isNonemptyArray from './isNonemptyArray';

describe('isNonemptyArray', () => {
  describe('true for', () => {
    it('should recognize number filled array', () => {
      const input = [1, 2, 3, 4];
      expect(isNonemptyArray(input)).toBe(true);
    });
    it('should recognize array with one element', () => {
      const input = [undefined];
      expect(isNonemptyArray(input)).toBe(true);
    });
  });
  describe('false for', () => {
    it('should false on empty array', () => {
      const input = [];
      expect(isNonemptyArray(input)).toBe(false);
    });
    it('should false on any number', () => {
      const input = 1;
      expect(isNonemptyArray(input)).toBe(false);
    });
  });
});
