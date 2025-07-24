"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CEREBRAS = exports.UI = exports.API = exports.PAGINATION = void 0;
// Centralized constants - No more magic numbers!
exports.PAGINATION = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
};
exports.API = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RATE_LIMIT: {
        WINDOW_MS: 900000,
        MAX_REQUESTS: 100,
    },
};
exports.UI = {
    SEARCH_DEBOUNCE: 300,
    ANIMATION_DURATION: 250,
    PAGE_SIZE: 12,
};
exports.CEREBRAS = {
    MODEL: 'llama3.1-8b',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    CONTEXT_LIMIT: 30,
};
