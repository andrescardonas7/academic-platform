'use client';

import {
  Bot,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  User,
  X,
} from 'lucide-react';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../../utils/api';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotWidgetProps {
  className?: string;
}

export function ChatbotWidget({ className = '' }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content:
        '¡Hola! Soy Orienta Cartago, tu asistente virtual especializado en orientación académica. ¿En qué puedo ayudarte hoy? Puedo informarte sobre carreras, instituciones, precios y modalidades disponibles en Cartago.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // KISS: Scroll to bot response start for better UX
  const scrollToBotResponse = useCallback(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const botMessages = document.querySelectorAll('[data-bot-message]');
        const lastBotMessage = botMessages[botMessages.length - 1];
        if (lastBotMessage) {
          lastBotMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBotResponse();
    } else {
      scrollToBottom();
    }
  }, [messages, scrollToBotResponse]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiClient.chatbot.sendMessage(userMessage.content);

      // Type-safe response handling
      if (response && typeof response === 'object' && 'data' in response) {
        const apiResponse = response as { data?: { message?: string } };

        if (apiResponse.data?.message) {
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: apiResponse.data.message,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      } else {
        throw new Error('Error en la comunicación con el servidor');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          'Lo siento, no pude procesar tu mensaje en este momento. Por favor, intenta de nuevo más tarde.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className='bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105'
          aria-label='Abrir chat'
        >
          <Bot className='w-6 h-6' />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-lg shadow-xl border border-gray-200 w-96 sm:w-[28rem] md:w-[32rem] lg:w-[36rem] flex flex-col transition-all duration-300 ${
            isMinimized ? 'h-auto' : 'min-h-[32rem] max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className='bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Bot className='w-5 h-5' />
              <span className='font-semibold'>Orienta Cartago</span>
            </div>
            <div className='flex items-center gap-1'>
              <button
                onClick={toggleMinimize}
                className='p-1 hover:bg-blue-700 rounded transition-colors'
                aria-label={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </button>
              <button
                onClick={toggleChat}
                className='p-1 hover:bg-blue-700 rounded transition-colors'
                aria-label='Cerrar chat'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className='flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    {...(!message.isUser && { 'data-bot-message': true })}
                  >
                    <div
                      className={`max-w-[90%] p-3 rounded-lg break-words overflow-hidden ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-900'
                      }`}
                    >
                      <div className='flex items-start gap-2'>
                        {!message.isUser && (
                          <Bot className='w-4 h-4 mt-0.5 flex-shrink-0' />
                        )}
                        <div className='flex-1'>
                          <MessageContent
                            content={message.content}
                            isUser={message.isUser}
                          />
                          <p className='text-xs opacity-70 mt-2'>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {message.isUser && (
                          <User className='w-4 h-4 mt-0.5 flex-shrink-0' />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className='flex justify-start'>
                    <div className='bg-gray-100 text-gray-900 max-w-[80%] p-3 rounded-lg'>
                      <div className='flex items-center gap-2'>
                        <Bot className='w-4 h-4' />
                        <div className='flex items-center gap-1'>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span className='text-sm'>Escribiendo...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className='p-4 border-t border-gray-200'>
                <div className='flex gap-2'>
                  <input
                    ref={inputRef}
                    type='text'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='Escribe tu mensaje...'
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm'
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    aria-label='Enviar mensaje'
                  >
                    <Send className='w-4 h-4' />
                  </button>
                </div>
                {messages.length === 1 && (
                  <SuggestionChips
                    onSelect={(suggestion) => sendMessage(suggestion)}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// KISS: Component for better message formatting
const MessageContent = ({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) => {
  // DRY: Format bot messages for better readability
  if (isUser) {
    return <p className='text-sm whitespace-pre-wrap'>{content}</p>;
  }

  // SonarQube: Better text processing for long responses
  const formatBotMessage = (text: string): JSX.Element[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    const elements: JSX.Element[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // KISS: Simple formatting rules
      if (trimmedLine.startsWith('===') && trimmedLine.endsWith('===')) {
        // Section headers
        const title = trimmedLine.replace(/=/g, '').trim();
        elements.push(
          <div
            key={index}
            className='font-bold text-blue-700 mt-3 mb-2 text-sm border-b border-blue-200 pb-1'
          >
            {title}
          </div>
        );
      } else if (trimmedLine.match(/^\d+\./)) {
        // Numbered lists (programs) - Simple and clean
        elements.push(
          <div key={index} className='mb-3 pl-2 border-l-2 border-blue-400'>
            <p className='text-sm font-medium text-gray-900 leading-relaxed break-words overflow-wrap-anywhere hyphens-auto'>
              {trimmedLine}
            </p>
          </div>
        );
      } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        // Bullet points - Improved readability
        elements.push(
          <div key={index} className='mb-2 text-sm flex items-start gap-2'>
            <span className='text-blue-600 font-bold mt-1 text-xs'>•</span>
            <span className='leading-relaxed text-gray-800 break-words overflow-wrap-anywhere'>
              {trimmedLine.replace(/^[•-]\s*/, '')}
            </span>
          </div>
        );
      } else if (trimmedLine.includes('**') && trimmedLine.includes('**')) {
        // Bold text formatting
        const parts = trimmedLine.split(/\*\*(.*?)\*\*/g);
        elements.push(
          <p
            key={index}
            className='text-sm mb-2 leading-relaxed break-words overflow-wrap-anywhere'
          >
            {parts.map((part, partIndex) =>
              partIndex % 2 === 1 ? (
                <strong key={partIndex} className='font-semibold text-blue-700'>
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      } else if (trimmedLine.length > 0) {
        // Regular paragraphs
        elements.push(
          <p
            key={index}
            className='text-sm mb-2 leading-relaxed text-gray-800 break-words overflow-wrap-anywhere'
          >
            {trimmedLine}
          </p>
        );
      }
    });

    return elements;
  };

  return <div className='space-y-1'>{formatBotMessage(content)}</div>;
};

const SuggestionChips = ({
  onSelect,
}: {
  onSelect: (suggestion: string) => void;
}) => {
  const suggestions = [
    '¿Qué ingenierías hay en Cartago?',
    'Busco carreras virtuales',
    '¿Cuánto cuesta estudiar psicología?',
    'Universidades con programas de salud',
  ];

  return (
    <div className='mt-3'>
      <p className='text-sm font-medium text-gray-600 mb-2'>Sugerencias:</p>
      <div className='flex flex-wrap gap-2'>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSelect(suggestion)}
            className='px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-xs hover:bg-gray-200 transition-colors'
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
