import { act, renderHook } from '@testing-library/react';
import { useSpeechRecognition } from '../useSpeechRecognition';

// Mock para SpeechRecognition
const mockSpeechRecognition = {
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  lang: '',
  continuous: false,
  interimResults: false,
  onstart: null,
  onresult: null,
  onerror: null,
  onend: null,
};

const mockSpeechRecognitionConstructor = jest.fn(() => mockSpeechRecognition);

describe('useSpeechRecognition', () => {
  const mockOnResult = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock global SpeechRecognition
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      writable: true,
      value: mockSpeechRecognitionConstructor,
    });
  });

  afterEach(() => {
    // Limpiar mocks
    delete (window as any).webkitSpeechRecognition;
    delete (window as any).SpeechRecognition;
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    expect(result.current.isListening).toBe(false);
    expect(result.current.isSupported).toBe(true);
    expect(typeof result.current.startListening).toBe('function');
    expect(typeof result.current.stopListening).toBe('function');
  });

  it('should detect when speech recognition is not supported', () => {
    // Remover soporte
    delete (window as any).webkitSpeechRecognition;

    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    expect(result.current.isSupported).toBe(false);
  });

  it('should start listening when startListening is called', () => {
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    act(() => {
      result.current.startListening();
    });

    expect(mockSpeechRecognitionConstructor).toHaveBeenCalled();
    expect(mockSpeechRecognition.start).toHaveBeenCalled();
  });

  it('should not start listening when not supported', () => {
    // Remover soporte
    delete (window as any).webkitSpeechRecognition;

    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    act(() => {
      result.current.startListening();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Speech recognition not supported in this browser'
    );
    expect(mockSpeechRecognition.start).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should configure recognition with correct settings', () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(mockOnResult, 'en-US')
    );

    act(() => {
      result.current.startListening();
    });

    expect(mockSpeechRecognition.lang).toBe('en-US');
    expect(mockSpeechRecognition.continuous).toBe(false);
    expect(mockSpeechRecognition.interimResults).toBe(false);
  });

  it('should handle onstart event', () => {
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    act(() => {
      result.current.startListening();
    });

    // Simular evento onstart
    act(() => {
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart({} as any);
      }
    });

    expect(result.current.isListening).toBe(true);
  });

  it('should handle onresult event', () => {
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    act(() => {
      result.current.startListening();
    });

    // Simular evento onresult
    const mockEvent = {
      results: [[{ transcript: 'Hello world' }]],
    };

    act(() => {
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent as any);
      }
    });

    expect(mockOnResult).toHaveBeenCalledWith('Hello world');
    expect(result.current.isListening).toBe(false);
  });

  it('should handle onerror event', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    act(() => {
      result.current.startListening();
    });

    // Simular evento onerror
    const mockError = { error: 'network' };

    act(() => {
      if (mockSpeechRecognition.onerror) {
        mockSpeechRecognition.onerror(mockError as any);
      }
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Speech recognition error:',
      'network'
    );
    expect(result.current.isListening).toBe(false);

    consoleSpy.mockRestore();
  });

  it('should handle onend event', () => {
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    act(() => {
      result.current.startListening();
    });

    // Simular evento onend
    act(() => {
      if (mockSpeechRecognition.onend) {
        mockSpeechRecognition.onend({} as any);
      }
    });

    expect(result.current.isListening).toBe(false);
  });

  it('should stop listening when stopListening is called', () => {
    const { result } = renderHook(() => useSpeechRecognition(mockOnResult));

    // Primero iniciar
    act(() => {
      result.current.startListening();
    });

    // Simular que está escuchando
    act(() => {
      if (mockSpeechRecognition.onstart) {
        mockSpeechRecognition.onstart({} as any);
      }
    });

    expect(result.current.isListening).toBe(true);

    // Parar
    act(() => {
      result.current.stopListening();
    });

    expect(result.current.isListening).toBe(false);
  });
});
