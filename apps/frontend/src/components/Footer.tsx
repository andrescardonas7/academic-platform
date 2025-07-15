import {
  AcademicCapIcon,
  EnvelopeIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon as AcademicCapSolid } from '@heroicons/react/24/solid';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center'>
                <AcademicCapSolid className='h-7 w-7 text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold'>Cartago Académico</h3>
                <p className='text-cyan-400 text-sm'>Diseña tu futuro</p>
              </div>
            </div>
            <p className='text-slate-300 mb-6 max-w-md leading-relaxed'>
              La plataforma que unifica la oferta académica de Cartago, Valle
              del Cauca. Conectamos estudiantes con su futuro académico ideal.
            </p>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 text-sm text-slate-400'>
                <MapPinIcon className='h-4 w-4' />
                <span>Cartago, Valle del Cauca</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-cyan-400'>
              Enlaces Rápidos
            </h4>
            <ul className='space-y-3'>
              <FooterLink href='#buscar'>Buscar Programas</FooterLink>
              <FooterLink href='#instituciones'>Instituciones</FooterLink>
              <FooterLink href='#carreras'>Carreras Populares</FooterLink>
              <FooterLink href='#becas'>Becas y Ayudas</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-cyan-400'>
              Contacto
            </h4>
            <ul className='space-y-3'>
              <li className='flex items-center gap-3 text-slate-300'>
                <EnvelopeIcon className='h-4 w-4 text-cyan-400' />
                <span className='text-sm'>info@cartagoacademico.co</span>
              </li>
              <li className='flex items-center gap-3 text-slate-300'>
                <PhoneIcon className='h-4 w-4 text-cyan-400' />
                <span className='text-sm'>+57 (2) 123-4567</span>
              </li>
              <li className='flex items-center gap-3 text-slate-300'>
                <AcademicCapIcon className='h-4 w-4 text-cyan-400' />
                <span className='text-sm'>Soporte 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 my-12 py-8 border-y border-slate-700/50'>
          <StatCard number='500+' label='Programas Académicos' />
          <StatCard number='50+' label='Instituciones Aliadas' />
          <StatCard number='24/7' label='Asistente IA Disponible' />
        </div>

        {/* Bottom Section */}
        <div className='flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700/50'>
          <div className='flex items-center gap-2 text-slate-400 text-sm mb-4 md:mb-0'>
            <span>© {currentYear} Cartago Académico. Hecho con</span>
            <HeartIcon className='h-4 w-4 text-red-400' />
            <span>para estudiantes de Cartago</span>
          </div>

          <div className='flex items-center gap-6 text-sm'>
            <FooterLink href='#privacidad'>Privacidad</FooterLink>
            <FooterLink href='#terminos'>Términos</FooterLink>
            <FooterLink href='#cookies'>Cookies</FooterLink>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500'></div>
    </footer>
  );
};

// Footer link component
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <li>
    <a
      href={href}
      className='text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm'
    >
      {children}
    </a>
  </li>
);

// Stat card component
interface StatCardProps {
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
  <div className='text-center p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30'>
    <div className='text-3xl font-bold text-cyan-400 mb-2'>{number}</div>
    <div className='text-slate-300 text-sm'>{label}</div>
  </div>
);

export default Footer;
