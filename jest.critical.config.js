const base = require('./jest.config');

module.exports = {
  ...base,
  collectCoverage: true,
  collectCoverageFrom: ['app/api/stripe/prices/route.ts', 'app/lib/metadata.ts'],
  testMatch: [
    '<rootDir>/tests/api/stripe-prices.route.test.ts',
    '<rootDir>/tests/unit/metadata.test.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    'app/api/stripe/prices/route.ts': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    'app/lib/metadata.ts': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
