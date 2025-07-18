import { apiClient, ApiError } from './index';

// Jest globals
declare const jest: any;
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeEach: any;
declare const afterEach: any;

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('search.offerings', () => {
    it('should fetch academic offerings successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          data: [
            {
              Id: '1',
              carrera: 'Test Career',
              institucion: 'Test Institution',
              modalidad: 'Presencial',
              duracion_semestres: 8,
              valor_semestre: 1000000,
              clasificacion: 'Test',
              nivel_programa: 'Pregrado',
              enlace: 'http://test.com',
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
          filters: {},
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await apiClient.search.offerings();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/search',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle search with filters', async () => {
      const mockResponse = {
        success: true,
        data: { data: [], pagination: {}, filters: {} },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const filters = { modalidad: 'Virtual', page: 1 };
      await apiClient.search.offerings(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/search?modalidad=Virtual&page=1',
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(apiClient.search.offerings()).rejects.toThrow(ApiError);
    });

    it('should handle timeout', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ success: true, data: {} }),
                } as Response),
              10000
            );
          })
      );

      const promise = apiClient.search.offerings();

      // Fast-forward time to trigger timeout
      jest.advanceTimersByTime(10000);

      await expect(promise).rejects.toThrow('Request timeout');
    });
  });

  describe('chatbot.sendMessage', () => {
    it('should send message successfully', async () => {
      const mockResponse = {
        success: true,
        data: { message: 'Test response' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await apiClient.chatbot.sendMessage('Hello');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/chatbot/message',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ message: 'Hello' }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('health', () => {
    it('should check health successfully', async () => {
      const mockResponse = {
        success: true,
        data: { status: 'ok' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await apiClient.health();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/health',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('ApiError', () => {
    it('should create ApiError with correct properties', () => {
      const error = new ApiError('Test error', '/test', 404);

      expect(error.message).toBe('Test error');
      expect(error.endpoint).toBe('/test');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('ApiError');
    });
  });
});
