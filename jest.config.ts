import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  openHandlesTimeout: 10000,
  testTimeout: 10000,
   collectCoverage: true, //collect coverage information
    coverageDirectory: 'coverage', //directory where Jest should output its coverage files
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts', //collect coverage from all TypeScript files in the src directory
    ]
};

export default config;