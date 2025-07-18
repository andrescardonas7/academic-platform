import { useCallback, useState } from 'react';
import { apiClient } from '../utils/api';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

/**
 * Hook personalizado para manejo del estado del chat
 * Sigue principios de responsabilidad única y separación de concerns
 */
export function useChat(initialMessage?: Message): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(() => {
    const defaultMessage: Message = {
      id: '1',
      content:
        '¡Hola! Soy Orienta Cartago, tu asistente académico. ¿En qué puedo ayudarte? Puedo ayudarte a encontrar programas, comparar instituciones o resolver dudas sobre tu futuro académico.',
      isUser: false,
      timestamp: new Date(),
    };
    return initialMessage ? [initialMessage] : [defaultMessage];
  });

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        content: content.trim(),
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await apiClient.chatbot.sendMessage(content.trim());

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            (response as { data?: { message?: string } })?.data?.message ||
            'Lo siento, no pude procesar tu mensaje. ¿Podrías intentar de nuevo?',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            'Lo siento, hay un problema técnico. Por favor intenta más tarde o reformula tu pregunta.',
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
