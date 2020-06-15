import isNonemptyArray from './isNonemptyArray';

describe('isNonemptyArray', () => {
  describe('returns true when:', () => {
    it('non empty number array is given', () => {
      const input = [1, 2, 3, 4];
      expect(isNonemptyArray(input)).toBe(true);
    });
    it('non empty undefined array is given', () => {
      const input = [undefined];
      expect(isNonemptyArray(input)).toBe(true);
    });
  });
  describe('returns false when:', () => {
    it('empty array is given', () => {
      const input = [];
      expect(isNonemptyArray(input)).toBe(false);
    });
    it('number input is given', () => {
      const input = 1;
      expect(isNonemptyArray(input)).toBe(false);
    });
  });
});
