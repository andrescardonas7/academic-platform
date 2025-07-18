import { useCallback, useState } from 'react';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

/**
 * Hook personalizado para manejo de reconocimiento de voz
 * Sigue el principio de responsabilidad única
 */
export function useSpeechRecognition(
  onResult: (transcript: string) => void,
  language: string = 'es-ES'
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);

  // Verificar si el navegador soporta reconocimiento de voz
  const isSupported =
    'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const startListening = useCallback(() => {
    if (!isSupported) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition =
      (
        window as typeof window & {
          webkitSpeechRecognition?: unknown;
          SpeechRecognition?: unknown;
        }
      ).webkitSpeechRecognition ||
      (
        window as typeof window & {
          webkitSpeechRecognition?: unknown;
          SpeechRecognition?: unknown;
        }
      ).SpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    type MinimalSpeechRecognitionEvent = {
      results: ArrayLike<ArrayLike<{ transcript: string }>>;
    };
    recognition.onresult = (event: MinimalSpeechRecognitionEvent) => {
      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
      setIsListening(false);
    };

    type MinimalSpeechRecognitionErrorEvent = {
      error: string;
    };
    recognition.onerror = (event: MinimalSpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isSupported, language, onResult]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    isSupported,
  };
}
