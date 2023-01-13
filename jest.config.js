/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    "^\\/.+\\.(ts)$": ['ts-jest', { /* ts-jest config goes here in Jest */ }],
  },
  transformIgnorePatterns: ["/node_modules", "/dist"],
};