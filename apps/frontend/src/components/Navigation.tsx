import {
  AcademicCapIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon as AcademicCapSolid } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

interface NavigationProps {
  onOpenChat?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onOpenChat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center'>
              <AcademicCapSolid className='h-6 w-6 text-white' />
            </div>
            <div className='hidden sm:block'>
              <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                Cartago Académico
              </h1>
              <p className='text-xs text-gray-500'>Diseña tu futuro</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-6'>
            <NavLink
              href='#buscar'
              icon={<MagnifyingGlassIcon className='h-4 w-4' />}
            >
              Buscar
            </NavLink>
            <NavLink
              href='#programas'
              icon={<AcademicCapIcon className='h-4 w-4' />}
            >
              Programas
            </NavLink>
            <NavLink
              href='#instituciones'
              icon={<InformationCircleIcon className='h-4 w-4' />}
            >
              Instituciones
            </NavLink>

            {/* Chat Button */}
            <button
              onClick={onOpenChat}
              className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25'
            >
              <ChatBubbleLeftRightIcon className='h-4 w-4' />
              Asistente IA
            </button>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Abrir menú'
            >
              {isMenuOpen ? (
                <XMarkIcon className='h-6 w-6' />
              ) : (
                <Bars3Icon className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-200/50'>
            <div className='flex flex-col gap-2'>
              <MobileNavLink
                href='#buscar'
                icon={<MagnifyingGlassIcon className='h-4 w-4' />}
              >
                Buscar Programas
              </MobileNavLink>
              <MobileNavLink
                href='#programas'
                icon={<AcademicCapIcon className='h-4 w-4' />}
              >
                Ver Programas
              </MobileNavLink>
              <MobileNavLink
                href='#instituciones'
                icon={<InformationCircleIcon className='h-4 w-4' />}
              >
                Instituciones
              </MobileNavLink>

              <button
                onClick={() => {
                  onOpenChat?.();
                  setIsMenuOpen(false);
                }}
                className='flex items-center gap-3 w-full px-4 py-3 text-left text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold mt-2'
              >
                <ChatBubbleLeftRightIcon className='h-5 w-5' />
                Asistente IA
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop navigation link component
interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, children }) => (
  <a
    href={href}
    className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
  >
    {icon}
    {children}
  </a>
);

// Mobile navigation link component
const MobileNavLink: React.FC<NavLinkProps> = ({ href, icon, children }) => (
  <a
    href={href}
    className='flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors'
  >
    {icon}
    {children}
  </a>
);

export default Navigation;
