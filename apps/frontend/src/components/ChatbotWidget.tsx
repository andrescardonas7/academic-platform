import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon as ChatSolid } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen: controlledIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        '¡Hola! Soy Orienta Cartago, tu asistente académico. ¿En qué puedo ayuoy? Puedo ayudarte a encontrar programas, comparar instituciones o resolver dudas sobre tu futuro académico.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleChat = onToggle || (() => setInternalIsOpen(!internalIsOpen));

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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.message ||
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    }
  };

  const quickQuestions = [
    '¿Qué carreras de ingeniería hay disponibles?',
    '¿Cuáles son las universidades más económicas?',
    '¿Hay programas virtuales disponibles?',
    '¿Qué becas puedo solicitar?',
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className='fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center group'
          aria-label='Abrir chat de asistente'
        >
          <ChatSolid className='h-8 w-8 group-hover:scale-110 transition-transform duration-300' />
          <div className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center'>
            <SparklesIcon className='h-3 w-3 text-white' />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className='fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
                <ChatBubbleLeftRightIcon className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='text-white font-semibold'>Orienta Cartago</h3>
                <p className='text-blue-100 text-sm'>Asistente académico IA</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className='text-white hover:bg-white/20 p-2 rounded-lg transition-colors'
              aria-label='Cerrar chat'
            >
              <XMarkIcon className='h-5 w-5' />
            </button>
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className='text-sm leading-relaxed'>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-gray-100 p-3 rounded-2xl'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className='space-y-2'>
                <p className='text-sm text-gray-500 font-medium'>
                  Preguntas frecuentes:
                </p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className='block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 transition-colors'
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='p-4 border-t border-gray-200'>
            <div className='flex items-center gap-2 bg-gray-50 rounded-xl p-2'>
              <input
                ref={inputRef}
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Escribe tu pregunta...'
                className='flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none'
                disabled={isLoading}
              />
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                }`}
                aria-label='Entrada por voz'
              >
                <MicrophoneIcon className='h-4 w-4' />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className='p-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed'
                aria-label='Enviar mensaje'
              >
                <PaperAirplaneIcon className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
