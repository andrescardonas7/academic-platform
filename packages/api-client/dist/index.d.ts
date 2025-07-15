import { ApiResponse, FilterOptions, SearchFilters, SearchResult } from '@academic/shared-types';
declare class ApiClient {
    private readonly baseURL;
    private readonly apiKey;
    private readonly defaultHeaders;
    constructor();
    private request;
    readonly search: {
        offerings: (filters?: SearchFilters) => Promise<ApiResponse<SearchResult>>;
        filters: () => Promise<ApiResponse<FilterOptions>>;
        byId: (id: string) => Promise<ApiResponse<any>>;
    };
    readonly chatbot: {
        sendMessage: (message: string) => Promise<ApiResponse<{
            message: string;
        }>>;
        health: () => Promise<ApiResponse<{
            status: string;
        }>>;
    };
    readonly health: () => Promise<ApiResponse<{
        status: string;
    }>>;
    private buildQueryParams;
    private isValidParam;
}
export declare class ApiError extends Error {
    endpoint: string;
    statusCode?: number | undefined;
    constructor(message: string, endpoint: string, statusCode?: number | undefined);
}
export declare const apiClient: ApiClient;
export declare const fetchAcademicOfferings: () => Promise<ApiResponse<SearchResult>>;
export declare const sendChatMessage: (message: string) => Promise<ApiResponse<{
    message: string;
}>>;
export declare const searchOfferings: (filters: SearchFilters) => Promise<ApiResponse<SearchResult>>;
export {};
//# sourceMappingURL=index.d.ts.map