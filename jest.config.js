module.exports = {
  // Root configuration for the entire project
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      rootDir: './backend',
      setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
      testMatch: [
        '<rootDir>/tests/**/*.test.js',
        '<rootDir>/tests/**/*.spec.js'
      ],
      collectCoverageFrom: [
        '<rootDir>/**/*.js',
        '!<rootDir>/node_modules/**',
        '!<rootDir>/tests/**',
        '!<rootDir>/server.js'
      ],
      coverageDirectory: '<rootDir>/coverage',
      coverageReporters: ['text', 'lcov', 'html'],
      testTimeout: 30000,
      verbose: true
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      rootDir: './frontend',
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
      ],
      collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
        '!<rootDir>/src/**/*.d.ts',
        '!<rootDir>/src/index.js',
        '!<rootDir>/src/reportWebVitals.js',
        '!<rootDir>/src/setupTests.js'
      ],
      coverageDirectory: '<rootDir>/coverage',
      coverageReporters: ['text', 'lcov', 'html'],
      moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
      },
      testTimeout: 10000,
      verbose: true
    }
  ],
  
  // Global configuration
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Test results processor
  testResultsProcessor: 'jest-sonar-reporter',
  
  // Coverage collection
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/*.config.js',
    '!**/setupTests.js',
    '!**/jest.config.js'
  ],
  
  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json'
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  
  // Module file extensions
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
    'node'
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@testing-library|@babel/runtime))'
  ],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Test timeout
  testTimeout: 30000,
  
  // Error on deprecated
  errorOnDeprecated: true,
  
  // Force exit after tests complete
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true,
  
  // Detect leaks
  detectLeaks: true
};
