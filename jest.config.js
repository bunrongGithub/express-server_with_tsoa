/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose:true,
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  moduleNameMapper: {
    '^@/src/(.*)$': '<rootDir>/src/$1',  // Same alias configuration as in tsconfig.json
  },
  testPathIgnorePatterns: ["<rootDir>/build/"],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/'],  // Ignore these directories
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testTimeout: 30000,
};
