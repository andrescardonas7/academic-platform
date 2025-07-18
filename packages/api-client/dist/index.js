"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchOfferings = exports.sendChatMessage = exports.fetchAcademicOfferings = exports.apiClient = exports.ApiError = void 0;
// Refactored API Client - SOLID principles, DRY, Clean Code
const shared_types_1 = require("@academic/shared-types");
class ApiClient {
    constructor() {
        // Search operations
        this.search = {
            offerings: async (filters = {}) => {
                const queryParams = this.buildQueryParams(filters);
                const endpoint = `/search${queryParams ? `?${queryParams}` : ''}`;
                return this.request(endpoint);
            },
            filters: async () => {
                return this.request('/search/filters');
            },
            byId: async (id) => {
                return this.request(`/search/${encodeURIComponent(id)}`);
            },
        };
        // Chatbot operations
        this.chatbot = {
            sendMessage: async (message) => {
                return this.request('/chatbot/message', {
                    method: 'POST',
                    body: JSON.stringify({ message }),
                });
            },
            health: async () => {
                return this.request('/chatbot/health');
            },
        };
        // Health check
        this.health = async () => {
            return this.request('/health');
        };
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        // API Key for development - in production use proper authentication
        this.apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'x-api-key': this.apiKey }),
        };
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), shared_types_1.API.TIMEOUT);
        const config = {
            headers: {
                ...this.defaultHeaders,
                ...options.headers,
            },
            signal: controller.signal,
            ...options,
        };
        try {
            const response = await fetch(url, config);
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            clearTimeout(timeoutId);
            console.error(`API request failed for ${endpoint}:`, error);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new ApiError('Request timeout', endpoint);
            }
            throw new ApiError(error instanceof Error ? error.message : 'Unknown API error', endpoint);
        }
    }
    buildQueryParams(params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (this.isValidParam(value)) {
                searchParams.append(key, String(value));
            }
        });
        return searchParams.toString();
    }
    isValidParam(value) {
        return value !== undefined && value !== null && value !== '';
    }
}
// Custom error class for better error handling
class ApiError extends Error {
    constructor(message, endpoint, statusCode) {
        super(message);
        this.name = 'ApiError';
        this.endpoint = endpoint;
        this.statusCode = statusCode;
    }
}
exports.ApiError = ApiError;
// Export singleton instance
exports.apiClient = new ApiClient();
// Legacy exports for backward compatibility
const fetchAcademicOfferings = () => exports.apiClient.search.offerings();
exports.fetchAcademicOfferings = fetchAcademicOfferings;
const sendChatMessage = (message) => exports.apiClient.chatbot.sendMessage(message);
exports.sendChatMessage = sendChatMessage;
const searchOfferings = (filters) => exports.apiClient.search.offerings(filters);
exports.searchOfferings = searchOfferings;
//# sourceMappingURL=index.js.map