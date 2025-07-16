"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Setup for Jest tests
const globals_1 = require("@jest/globals");
Object.defineProperty(global, 'fetch', {
    value: globals_1.jest.fn(),
    writable: true,
});
//# sourceMappingURL=setupTests.js.map