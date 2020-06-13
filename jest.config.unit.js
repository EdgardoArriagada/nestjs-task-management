module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(.*?)\\.unit\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
};

