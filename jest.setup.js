// Jest setup file
// Global test configuration

// Mock fetch for Node.js environment
global.fetch = jest.fn();

// Setup global test utilities
beforeEach(() => {
  jest.clearAllMocks();
});

// Add custom matchers if needed
expect.extend({
  // Custom matchers can be added here
});
