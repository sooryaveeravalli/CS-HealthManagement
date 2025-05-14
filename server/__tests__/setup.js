import mongoose from 'mongoose';

/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  setupFilesAfterEnv: ['./__tests__/jest.setup.js'],
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};

// Create a jest.setup.js file for database connection handling
export const setupTestDB = () => {
  // Connect to the test database before running tests
  beforeAll(async () => {
    const uri = `${process.env.ATLAS_URI}/hms_test`;
    await mongoose.connect(uri);
  });

  // Clear all test data after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
  });

  // Disconnect from the test database after all tests
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
}; 