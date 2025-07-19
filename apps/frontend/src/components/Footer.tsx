import {
  AcademicCapIcon,
  EnvelopeIcon,
  HeartIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon as AcademicCapSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center'>
                <AcademicCapSolid className='h-7 w-7 text-white' />
              </div>
              <div>
                <h3 className='text-2xl font-bold'>Cartago Académico</h3>
                <p className='text-cyan-400 text-sm'>Diseña tu futuro</p>
              </div>
            </div>
            <p className='text-slate-200 mb-6 max-w-md leading-relaxed'>
              La plataforma que unifica la oferta académica de Cartago, Valle
              del Cauca. Conectamos estudiantes con su futuro académico ideal.
            </p>

            {/* Creator Info - Moved here for better alignment */}
            <div className='flex flex-col gap-2 mt-6'>
              <div className='flex items-center gap-2 text-slate-200 text-sm'>
                <span>Hecho en Cartaguito</span>
                <span className='text-yellow-400 text-lg'>☀️</span>
              </div>
              <div className='flex items-center gap-2 text-slate-300 text-sm'>
                <span>Desarrollo:</span>
                <a
                  href='https://www.linkedin.com/in/andréscardona'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium hover:underline'
                >
                  Andrés Cardona
                </a>
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
              <ContactItem icon={EnvelopeIcon} text='fecasa94@gmail.com' />
              <ContactItem
                icon={PhoneIcon}
                text='+573154585901'
                href='https://wa.me/573154585901'
                isExternal
              />
              <ContactItem icon={AcademicCapIcon} text='Soporte 24/7' />
            </ul>
          </div>

          {/* Sponsor Section */}
          <div>
            <h4 className='text-lg font-semibold mb-4 text-cyan-400'>
              Sponsor
            </h4>
            <ul className='space-y-3'>
              <SponsorItem
                logoSrc='/buho.svg'
                name='Labs'
                description='Desarrollo de software'
              />
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-700/50'>
          <div className='flex items-center gap-2 text-slate-200 text-sm mb-4 md:mb-0'>
            <span>© {currentYear} Cartago Académico</span>
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
      className='text-slate-200 hover:text-cyan-400 transition-colors duration-200 text-sm'
    >
      {children}
    </a>
  </li>
);

// Contact item component - DRY principle
interface ContactItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  href?: string;
  isExternal?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({
  icon: Icon,
  text,
  href,
  isExternal,
}) => (
  <li className='flex items-center gap-3 text-slate-300'>
    <Icon className='h-4 w-4 text-cyan-400' />
    {href ? (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className='text-sm hover:text-cyan-400 transition-colors duration-200 cursor-pointer'
      >
        {text}
      </a>
    ) : (
      <span className='text-sm'>{text}</span>
    )}
  </li>
);

// Sponsor item component - DRY principle
interface SponsorItemProps {
  logoSrc: string;
  name: string;
  description: string;
  href?: string;
}

const SponsorItem: React.FC<SponsorItemProps> = ({
  logoSrc,
  name,
  description,
  href,
}) => (
  <li className='flex items-center gap-3 text-slate-300'>
    <div className='w-18 h-18 flex items-center justify-center'>
      <Image
        src={logoSrc}
        alt={name}
        width={50}
        height={50}
        className='opacity-80 hover:opacity-100 transition-opacity duration-200 filter brightness-0 invert'
      />
    </div>
    <div className='flex flex-col'>
      {href ? (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm font-medium text-slate-200 hover:text-cyan-400 transition-colors duration-200'
        >
          {name}
        </a>
      ) : (
        <span className='text-sm font-medium text-slate-200'>{name}</span>
      )}
      <span className='text-xs text-slate-400'>{description}</span>
    </div>
  </li>
);

export default Footer;
