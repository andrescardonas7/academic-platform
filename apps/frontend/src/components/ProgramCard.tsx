import {
  ArrowTopRightOnSquareIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  StarIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface Program {
  Id: string;
  carrera: string;
  institucion: string;
  modalidad: string;
  duracion_semestres: number;
  valor_semestre: number;
  jornada?: string;
  clasificacion: string;
  nivel_programa: string;
  enlace: string;
}

interface ProgramCardProps {
  program: Program;
  onClick?: (program: Program) => void;
  className?: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onClick,
  className = '',
}) => {
  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'Gratuito';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDurationText = (semesters: number) => {
    const years = Math.ceil(semesters / 2);
    return `${years} año${years !== 1 ? 's' : ''} (${semesters} semestres)`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'pregrado':
        return 'from-blue-500 to-cyan-500';
      case 'posgrado':
        return 'from-purple-500 to-pink-500';
      case 'maestría':
        return 'from-green-500 to-emerald-500';
      case 'doctorado':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getModalityIcon = (modalidad: string) => {
    if (
      modalidad.toLowerCase().includes('virtual') ||
      modalidad.toLowerCase().includes('distancia')
    ) {
      return <ComputerDesktopIcon className='h-4 w-4' />;
    }
    return <BuildingOfficeIcon className='h-4 w-4' />;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(program);
    }
  };

  return (
    <button
      id={`program-card-${program.carrera.toLowerCase().replace(/\s+/g, '-')}`}
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2 ${onClick ? 'cursor-pointer' : 'cursor-default'} ${className} text-left`}
      onClick={onClick ? handleClick : undefined}
      disabled={!onClick}
      aria-label={
        onClick
          ? `Ver detalles de ${program.carrera} en ${program.institucion}`
          : undefined
      }
    >
      {/* Gradient overlay on hover */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

      <div className='relative z-10'>
        {/* Header */}
        <div className='flex justify-between items-start mb-4'>
          <div className='flex-1'>
            <h3 className='text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-900 transition-colors duration-300 mb-2'>
              {program.carrera}
            </h3>
            <div className='flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
              <div className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mr-2 group-hover:from-blue-200 group-hover:to-cyan-200 transition-colors duration-300'>
                <AcademicCapIcon className='h-4 w-4 text-blue-600' />
              </div>
              <span className='font-semibold text-sm'>
                {program.institucion}
              </span>
            </div>
          </div>
          <div
            className={`ml-4 px-3 py-1 rounded-full bg-gradient-to-r ${getLevelColor(program.nivel_programa)} text-white text-xs font-semibold shadow-lg flex items-center gap-1`}
          >
            <StarIcon className='h-3 w-3' />
            {program.nivel_programa}
          </div>
        </div>

        {/* Details Grid */}
        <div className='grid grid-cols-1 gap-3 mb-6'>
          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-300'>
            <div className='flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
              <ClockIcon className='h-4 w-4 mr-2 text-blue-500' />
              <span className='text-sm font-medium'>Duración</span>
            </div>
            <span className='text-sm font-semibold text-gray-900'>
              {getDurationText(program.duracion_semestres)}
            </span>
          </div>

          <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-300'>
            <div className='flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
              {getModalityIcon(program.modalidad)}
              <span className='text-sm font-medium ml-2'>Modalidad</span>
            </div>
            <span className='text-sm font-semibold text-gray-900'>
              {program.modalidad}
            </span>
          </div>

          {program.jornada && (
            <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-300'>
              <div className='flex items-center text-gray-600 group-hover:text-gray-800 transition-colors duration-300'>
                <SunIcon className='h-4 w-4 mr-2 text-yellow-500' />
                <span className='text-sm font-medium'>Jornada</span>
              </div>
              <span className='text-sm font-semibold text-gray-900'>
                {program.jornada}
              </span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className='flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300'>
          <div className='flex items-center'>
            <div className='w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors duration-300'>
              <CurrencyDollarIcon className='h-5 w-5 text-green-600' />
            </div>
            <div>
              <p className='text-xs text-gray-500 font-medium'>Por semestre</p>
              <p className='text-lg font-bold text-green-600'>
                {formatCurrency(program.valor_semestre)}
              </p>
            </div>
          </div>

          <div className='flex gap-2'>
            <a
              href={program.enlace}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-blue-500/25'
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowTopRightOnSquareIcon className='h-4 w-4' />
              Oficial
            </a>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className='absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
      <div className='absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
    </button>
  );
};

export default ProgramCard;
