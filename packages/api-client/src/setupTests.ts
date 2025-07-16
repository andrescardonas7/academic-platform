// Setup for Jest tests
import { jest } from '@jest/globals';

Object.defineProperty(global, 'fetch', {
  value: jest.fn(),
  writable: true,
});
