export default {
  transform: {},
  testTimeout: 30000,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['./tests/setup.js'],
}; 