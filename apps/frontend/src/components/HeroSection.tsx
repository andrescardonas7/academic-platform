import {
  MagnifyingGlassIcon,
  MicrophoneIcon,
} from '@heroicons/react/24/outline';
import { BoltIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  return (
    <section className='relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden'>
      {/* Animated background particles */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute top-40 left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative z-10 container mx-auto px-4 py-20 flex flex-col justify-center min-h-screen'>
        <div className='text-center max-w-5xl mx-auto'>
          {/* Main heading */}
          <h1 className='text-6xl md:text-7xl font-bold mb-6 leading-tight'>
            Diseña tu futuro.
            <br />
            <span className='bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
              Encuéntralo en Cartago.
            </span>
          </h1>

          {/* Subtitle */}
          <p className='text-xl md:text-2xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed'>
            La plataforma que unifica la oferta académica de la región.{' '}
            <span className='text-cyan-400 font-medium'>
              Busca, compara y decide.
            </span>
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className='max-w-3xl mx-auto mb-16'>
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000'></div>
              <div className='relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0 pl-4'>
                    <MagnifyingGlassIcon className='h-6 w-6 text-slate-400' />
                  </div>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='e.g., Psicología'
                    className='flex-1 bg-transparent px-4 py-4 text-lg text-white placeholder-slate-400 focus:outline-none'
                  />
                  <button
                    type='button'
                    onClick={handleVoiceSearch}
                    className={`flex-shrink-0 p-3 rounded-xl transition-colors ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <MicrophoneIcon className='h-5 w-5' />
                  </button>
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25'
            >
              <span className='flex items-center gap-2'>
                ✨ Descubrir
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
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
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
            <div className='group text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                <MagnifyingGlassIcon className='h-8 w-8 text-white' />
              </div>
              <div className='text-4xl font-bold text-white mb-2'>500+</div>
              <div className='text-slate-300'>Programas académicos</div>
            </div>

            <div className='group text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                <BuildingOfficeIcon className='h-8 w-8 text-white' />
              </div>
              <div className='text-4xl font-bold text-white mb-2'>50+</div>
              <div className='text-slate-300'>Universidades</div>
            </div>

            <div className='group text-center p-6 rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 hover:bg-slate-800/50 transition-all duration-300'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                <BoltIcon className='h-8 w-8 text-white' />
              </div>
              <div className='text-4xl font-bold text-white mb-2'>24/7</div>
              <div className='text-slate-300'>Asistente IA</div>
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
