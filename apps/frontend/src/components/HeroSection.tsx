import {
  MagnifyingGlassIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';
import { BoltIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  clearTrigger?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  clearTrigger,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Limpia el campo cuando clearTrigger cambia
  React.useEffect(() => {
    setSearchQuery('');
  }, [clearTrigger]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setTimeout(() => {
        const query = searchQuery.trim().toLowerCase();
        const cards = document.querySelectorAll('[id^="program-card-"]');
        cards.forEach((card) => {
          if (card instanceof HTMLElement && card.id.includes(query)) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (typeof card.focus === 'function') card.focus();
          }
        });
        // Eliminar limpieza automática del campo y del filtro
      }, 300);
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'es-ES';
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
          setSearchQuery(transcript);
        }
        setIsListening(false);
      };

      type MinimalSpeechRecognitionErrorEvent = {
        error: string;
      };

      recognition.onerror = (event: MinimalSpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <section className='relative min-h-screen text-white overflow-hidden'>
      {/* Background image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: 'url(/image-back.webp)',
        }}
      >
        {/* Overlay gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-indigo-900/40'></div>
      </div>

      {/* Animated background particles */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000'></div>
        <div className='absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative z-10 container mx-auto px-4 py-20 flex flex-col justify-center min-h-screen'>
        <div className='text-center max-w-5xl mx-auto'>
          {/* Main heading */}
          <header>
            <h1
              className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg'
              aria-label='Campus Cartago - Busca tu futuro académico aquí'
            >
              Campus Cartago.
              <br />
              <span className='bg-gradient-to-r from-[#e33373] to-[#fdde03] bg-clip-text text-transparent drop-shadow-sm'>
                Busca tu futuro aquí.
              </span>
            </h1>
          </header>

          {/* Subtitle */}
          <p className='text-xl md:text-2xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed'>
            La plataforma que unifica la oferta académica de la región.{' '}
            <span className='text-[#f5c842] font-medium drop-shadow-lg'>
              Busca, compara y decide.
            </span>
          </p>

          {/* Search form */}
          <form
            onSubmit={handleSubmit}
            className='max-w-3xl mx-auto mb-4'
            role='search'
            aria-label='Buscar programas académicos'
          >
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-[#e33373] to-[#fdde03] rounded-2xl blur opacity-25 group-hover:opacity-40 group-focus-within:opacity-50 transition duration-1000'></div>
              <div className='relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 group-focus-within:border-[#e33373]/50 transition-all duration-300'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 pl-4'>
                    <MagnifyingGlassIcon className='h-6 w-6 text-slate-400 group-focus-within:text-[#f5c842] transition-colors duration-300' />
                  </div>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='e.g., Psicología, Ingeniería, Medicina...'
                    className='flex-1 bg-transparent px-4 py-4 text-lg text-white placeholder-slate-300 focus:outline-none focus:placeholder-slate-400 transition-colors duration-300'
                    aria-label='Campo de búsqueda de programas académicos'
                    aria-describedby='search-help'
                  />
                  <button
                    type='button'
                    onClick={handleVoiceSearch}
                    className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse scale-110'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                    aria-label={
                      isListening ? 'Escuchando...' : 'Buscar por voz'
                    }
                    title={
                      isListening
                        ? 'Escuchando tu voz'
                        : 'Hacer búsqueda por voz'
                    }
                  >
                    <MicrophoneIcon className='h-5 w-5' />
                  </button>
                </div>
              </div>
            </div>
            <div id='search-help' className='sr-only'>
              Escribe el nombre de un programa académico para buscar opciones
              disponibles en Cartago
            </div>

            <button
              type='submit'
              className='group mt-6 bg-gradient-to-r from-[#e33373] to-[#fdde03] hover:from-[#e33373]/90 hover:to-[#fdde03]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#e33373]/25 focus:outline-none focus:ring-4 focus:ring-[#e33373]/30'
              aria-label='Buscar programas académicos'
              disabled={!searchQuery.trim()}
            >
              <span className='flex items-center gap-2'>
                <span className='group-hover:animate-pulse'>✨</span>
                Descubrir
                <svg
                  className='w-5 h-5 transition-transform duration-300 group-hover:translate-x-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 8l4 4m0 0l-4 4m4-4H3'
                  />
                </svg>
              </span>
            </button>
          </form>

          {/* Stats */}
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'
            role='region'
            aria-label='Estadísticas de la plataforma'
          >
            <div className='group text-center p-6 rounded-2xl bg-slate-900/85 border border-slate-700/40 hover:bg-slate-900/95 hover:border-[#e33373]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#e33373]/20 hover:-translate-y-1'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#e33373] to-[#fdde03] rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg'>
                <MagnifyingGlassIcon className='h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300' />
              </div>
              <div className='text-4xl font-bold text-white mb-2 group-hover:text-[#f5c842] transition-colors duration-300'>
                27+
              </div>
              <div className='text-slate-300 group-hover:text-slate-200 transition-colors duration-300'>
                Programas académicos
              </div>
            </div>

            <div className='group text-center p-6 rounded-2xl bg-slate-900/85 border border-slate-700/40 hover:bg-slate-900/95 hover:border-[#e33373]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#e33373]/20 hover:-translate-y-1'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#e33373]/80 to-[#e33373] rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg'>
                <BuildingOfficeIcon className='h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300' />
              </div>
              <div className='text-4xl font-bold text-white mb-2 group-hover:text-[#e33373] transition-colors duration-300'>
                5+
              </div>
              <div className='text-slate-300 group-hover:text-slate-200 transition-colors duration-300'>
                Universidades
              </div>
            </div>

            <div className='group text-center p-6 rounded-2xl bg-slate-900/85 border border-slate-700/40 hover:bg-slate-900/95 hover:border-[#fdde03]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#fdde03]/20 hover:-translate-y-1'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#fdde03] to-[#fdde03]/80 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg'>
                <BoltIcon className='h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300' />
              </div>
              <div className='text-4xl font-bold text-white mb-2 group-hover:text-[#f5c842] transition-colors duration-300'>
                24/7
              </div>
              <div className='text-slate-300 group-hover:text-slate-200 transition-colors duration-300'>
                Asistente IA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse'></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;