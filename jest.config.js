module.exports = {
  coverageDirectory: '__coverage__',
  coverageThreshold: {
    global: {
      branches: 97,
      functions: 97,
      lines: 97,
      statements: 97,
    },
  },
  collectCoverageFrom: [
    '<rootDir>/lib/**',
    '!<rootDir>/src/**/__snapshots__/**',
    '!<rootDir>/__tests__/helpers/**/*',
    '!<rootDir>/__tests__/helpers/*',
    '!<rootDir>/lib/dataSourceValidation/schemas/**',
    '!<rootDir>/lib/molotov.json',
    '!<rootDir>/lib/inspector/**',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/__helpers__/',
    '<rootDir>/__tests__/.*/[__mocks__|files]/',
    '<rootDir>/lib/molotov.json',
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  reporters: ['default'],
};
