module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/common/models/**/*.ts',
    '!src/server/*.ts',
    '!src/server/utils/constants.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
};
