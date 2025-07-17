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
import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await apiClient.chatbot.sendMessage(userMessage.content);

      if (data && (data as any).data?.message) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: (data as any).data.message,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Error en la comunicación');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
        <div className='bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-96 flex flex-col'>
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
              <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className='flex items-start gap-2'>
                        {!message.isUser && (
                          <Bot className='w-4 h-4 mt-0.5 flex-shrink-0' />
                        )}
                        <div className='flex-1'>
                          <p className='text-sm whitespace-pre-wrap'>
                            {message.content}
                          </p>
                          <p className='text-xs opacity-70 mt-1'>
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
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    aria-label='Enviar mensaje'
                  >
                    <Send className='w-4 h-4' />
                  </button>
                </div>
                <p className='text-xs text-gray-500 mt-2 text-center'>
                  Presiona Enter para enviar
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
