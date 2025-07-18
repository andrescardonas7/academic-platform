import { Clock, DollarSign, ExternalLink, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface Oferta {
  Id: string;
  carrera: string;
  institucion: string;
  modalidad: string;
  duracion_semestres: number;
  valor_semestre: number;
  jornada?: string;
  clasificacion?: string;
  nivel_programa?: string;
  enlace?: string;
}

interface AcademicGridProps {
  data: Oferta[];
  loading?: boolean;
  className?: string;
}

export function AcademicGrid({
  data,
  loading = false,
  className = '',
}: AcademicGridProps) {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse'
          >
            {/* Title skeleton */}
            <div className='h-6 bg-gray-200 rounded mb-3 w-3/4'></div>

            {/* Institution skeleton */}
            <div className='h-4 bg-gray-200 rounded mb-4 w-1/2'></div>

            {/* Tags skeleton */}
            <div className='flex gap-2 mb-4'>
              <div className='h-6 bg-gray-200 rounded-full w-20'></div>
              <div className='h-6 bg-gray-200 rounded-full w-24'></div>
            </div>

            {/* Details skeleton */}
            <div className='space-y-2 mb-4'>
              <div className='h-4 bg-gray-200 rounded w-full'></div>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
              <div className='h-4 bg-gray-200 rounded w-1/2'></div>
            </div>

            {/* Price skeleton */}
            <div className='h-5 bg-gray-200 rounded w-1/3'></div>
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='max-w-md mx-auto'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <GraduationCap className='w-8 h-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No se encontraron resultados
          </h3>
          <p className='text-gray-500'>
            Intenta ajustar los filtros o realizar una nueva búsqueda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {data.map((oferta) => (
        <div
          key={oferta.Id}
          className='group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 relative overflow-hidden'
        >
          {/* Hover effect overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>

          <div className='relative z-10'>
            {/* Header */}
            <div className='mb-4'>
              <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors'>
                {oferta.carrera}
              </h3>
              <div className='flex items-center gap-2 text-sm text-gray-600 mb-3'>
                <span className='font-medium'>{oferta.institucion}</span>
              </div>
            </div>

            {/* Tags */}
            <div className='flex flex-wrap gap-2 mb-4'>
              <span className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
                <Clock className='w-3 h-3' />
                {oferta.modalidad}
              </span>
              <span className='inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>
                <GraduationCap className='w-3 h-3' />
                {oferta.duracion_semestres} semestres
              </span>
              {oferta.jornada && (
                <span className='inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full'>
                  {oferta.jornada}
                </span>
              )}
            </div>

            {/* Details */}
            <div className='space-y-2 mb-4 text-sm text-gray-600'>
              <div className='flex justify-between'>
                <span className='font-medium'>Clasificación:</span>
                <span>{oferta.clasificacion}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium'>Nivel:</span>
                <span>{oferta.nivel_programa}</span>
              </div>
            </div>

            {/* Price */}
            <div className='mb-4'>
              <div className='flex items-center gap-2'>
                <DollarSign className='w-5 h-5 text-green-600' />
                <span className='text-xl font-bold text-green-600'>
                  {oferta.valor_semestre > 0
                    ? `$${oferta.valor_semestre.toLocaleString()}`
                    : 'Gratuito'}
                </span>
                {oferta.valor_semestre > 0 && (
                  <span className='text-sm text-gray-500'>por semestre</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-2 pt-4 border-t border-gray-100'>
              <a
                href={oferta.enlace}
                target='_blank'
                rel='noopener noreferrer'
                className='flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
                Oficial
              </a>
              <Link
                href={`/carrera/${oferta.Id}`}
                className='flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors'
              >
                Detalle
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
