require('dotenv').config({ path: '.env.test.local' });
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  verbose: true,
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFiles: ['dotenv/config'],
  collectCoverageFrom: ['src/**/*.tsx', 'src/**/*.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/tests/$1',
  },
};
