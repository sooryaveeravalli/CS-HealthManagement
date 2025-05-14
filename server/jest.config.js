/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  setupFilesAfterEnv: ['./__tests__/jest.setup.js'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  collectCoverage: false,
  coverageDirectory: null
}; 