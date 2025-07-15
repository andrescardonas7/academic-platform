// Centralized constants - No more magic numbers!
export const PAGINATION = {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    DEFAULT_PAGE: 1,
};
export const API = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RATE_LIMIT: {
        WINDOW_MS: 900000,
        MAX_REQUESTS: 100,
    },
};
export const UI = {
    SEARCH_DEBOUNCE: 300,
    ANIMATION_DURATION: 250,
    PAGE_SIZE: 12,
};
export const CEREBRAS = {
    MODEL: 'llama3.1-8b',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    CONTEXT_LIMIT: 30,
};
