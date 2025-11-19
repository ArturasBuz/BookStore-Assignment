module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@env/(.*)': '<rootDir>/src/environments/$1',
    '@mocks/(.*)': '<rootDir>/mocks/$1',
    '@openapi': '<rootDir>/openapi/generated/index',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/main.ts',
    '<rootDir>/src/polyfills.ts',
    '<rootDir>/src/environments',
    '<rootDir>/openapi/*',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['text', 'text-summary', 'json', ['lcov', { projectRoot: '/' }]],
  testPathIgnorePatterns: [],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.routes.ts',
    '!src/**/*.html',
    '!src/**/*.module.ts',
    '!src/**/*.config.ts',
    '!**/*.predicate.ts',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  verbose: true,
};
