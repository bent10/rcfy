/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jest-environment-node',
  transform: {
    '^.*.ts$': ['@swc/jest']
  },
  extensionsToTreatAsEsm: ['.ts'],
  watchPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/(index|types).js',
    '/test/'
  ]
}
